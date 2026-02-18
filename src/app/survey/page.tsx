'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Send, Loader2, CheckCircle2, User, Briefcase } from 'lucide-react'
import { HK_DISTRICTS, RELATIONS, AMOUNTS, GIVER_IDENTITIES, RECEIVER_IDENTITIES, GREETINGS, AGE_GROUPS } from '@/lib/constants'
import { submitSurvey } from '@/app/actions'
import type { SurveyData } from '@/lib/types'

export default function SurveyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') || 'giver'
  const isGiver = role === 'giver'
  const identityOptions = isGiver ? GIVER_IDENTITIES : RECEIVER_IDENTITIES

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedIdentityId, setSelectedIdentityId] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [rateLimitMsg, setRateLimitMsg] = useState('')

  const [formData, setFormData] = useState<SurveyData>({
    identity: '',
    role: role,
    age_group: '',
    district: '',
    relation: '',
    amount: 0,
    greeting: '',
  })

  const currentIdentity = identityOptions.find(i => i.id === selectedIdentityId) || null

  const totalSteps = 6

  const updateFormData = (field: keyof SurveyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedIdentityId !== ''
      case 2:
        return formData.age_group !== ''
      case 3:
        return formData.district !== ''
      case 4:
        return formData.relation !== ''
      case 5:
        return formData.amount > 0 || (formData.customAmount && formData.customAmount > 0)
      case 6:
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (honeypot) return  // Bot detected, silently abort

    // Rate limit: 30 秒內不可重複提交
    const RATE_LIMIT_MS = 30_000
    const lastSubmit = localStorage.getItem('last_submit_time')
    if (lastSubmit) {
      const elapsed = Date.now() - parseInt(lastSubmit, 10)
      if (elapsed < RATE_LIMIT_MS) {
        const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000)
        setRateLimitMsg(`提交太快，請等 ${remaining} 秒後再試`)
        setTimeout(() => setRateLimitMsg(''), 3000)
        return
      }
    }

    setIsSubmitting(true)
    setSubmitError('')

    const finalAmount = formData.customAmount || formData.amount
    const identityName = currentIdentity?.name || ''

    const submissionData = {
      timestamp: new Date().toISOString(),
      district: formData.district,
      identity: identityName,
      role: role,
      age_group: formData.age_group,
      relation: formData.relation,
      amount: finalAmount,
      greeting: formData.greeting || '恭喜發財',
    }

    console.log('📤 提交數據:', submissionData)

    try {
      const result = await submitSurvey(submissionData)

      if (result.success) {
        console.log('✅ 提交成功')
        localStorage.setItem('last_submit_time', Date.now().toString())
        setSubmitSuccess(true)

        const params = new URLSearchParams({
          role: role,
          age_group: formData.age_group,
          identity: selectedIdentityId,
          district: formData.district,
          relation: formData.relation,
          amount: finalAmount.toString(),
          greeting: formData.greeting || '恭喜發財',
        })

        setTimeout(() => {
          router.push(`/result?${params.toString()}`)
        }, 1500)
      } else {
        setSubmitError(result.error || '提交失敗，請重試')
        setIsSubmitting(false)
      }
    } catch (error) {
      setSubmitError('發生錯誤，請重試')
      setIsSubmitting(false)
    }
  }

  const renderMascotHeader = () => {
    if (!currentIdentity) {
      return (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-4 border-yellow-400/50 flex items-center justify-center text-3xl">
            {isGiver ? '🧧' : '💰'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-yellow-300">
              {isGiver ? '我要派利是' : '我係收利是'}
            </h1>
            <p className="text-yellow-200/80 text-sm">填寫你嘅利是行情</p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-4 border-yellow-400 shadow-lg flex items-center justify-center text-4xl">
          {currentIdentity.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-yellow-300">
            {currentIdentity.name}
          </h1>
          <p className="text-yellow-200/80 text-sm">{currentIdentity.description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-amber-900">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要內容 */}
      <main className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* 頂部 - 返回按鈕 + 進度 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">返回</span>
          </button>

          {/* 吉祥物標題 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {renderMascotHeader()}
          </motion.div>

          {/* 進度條 */}
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? 'bg-yellow-400'
                    : 'bg-yellow-900/30'
                }`}
              />
            ))}
          </div>
          <p className="text-yellow-200/70 text-sm text-center">
            步驟 {currentStep} / {totalSteps}
          </p>
        </div>

        {/* 問卷內容區域 */}
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            {/* Step 1: 職業 / 身份 */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="text-yellow-400" size={32} />
                  <h2 className="text-3xl font-bold text-yellow-300">你做咩嘅？</h2>
                </div>
                <p className="text-yellow-200/70 mb-6">選擇你嘅身份</p>

                <div className="space-y-3">
                  {identityOptions.map((identity) => (
                    <label
                      key={identity.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedIdentityId === identity.id
                          ? 'bg-yellow-500/20 border-yellow-400 scale-[1.02]'
                          : 'bg-red-800/30 border-yellow-500/20 hover:border-yellow-400/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="identity"
                        value={identity.id}
                        checked={selectedIdentityId === identity.id}
                        onChange={() => {
                          setSelectedIdentityId(identity.id)
                          updateFormData('identity', identity.id)
                        }}
                        className="w-5 h-5 text-yellow-400 focus:ring-yellow-400"
                      />
                      <span className="text-3xl">{identity.emoji}</span>
                      <div className="flex-1">
                        <p className="text-yellow-100 font-bold text-lg">{identity.name}</p>
                        <p className="text-yellow-200/60 text-xs">{identity.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: 年齡組別 */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-yellow-400" size={32} />
                  <h2 className="text-3xl font-bold text-yellow-300">你幾多歲？</h2>
                </div>
                <p className="text-yellow-200/70 mb-6">選擇你嘅年齡組別</p>

                <div className="space-y-3">
                  {AGE_GROUPS.map((ageGroup) => (
                    <label
                      key={ageGroup}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.age_group === ageGroup
                          ? 'bg-yellow-500/20 border-yellow-400'
                          : 'bg-red-800/30 border-yellow-500/20 hover:border-yellow-400/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="age_group"
                        value={ageGroup}
                        checked={formData.age_group === ageGroup}
                        onChange={(e) => updateFormData('age_group', e.target.value)}
                        className="w-5 h-5 text-yellow-400 focus:ring-yellow-400"
                      />
                      <span className="text-yellow-100 font-medium text-lg">{ageGroup}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: 地區 */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">你住邊區？</h2>
                <p className="text-yellow-200/70 mb-6">選擇你嘅地區</p>

                <select
                  value={formData.district}
                  onChange={(e) => updateFormData('district', e.target.value)}
                  className="w-full px-4 py-4 text-lg bg-red-800/50 border-2 border-yellow-500/30 rounded-xl text-yellow-100 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                >
                  <option value="">選擇地區...</option>
                  {HK_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {/* Step 4: 派畀邊個 / 邊個派畀你 */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  {isGiver ? '你派畀邊個？' : '邊個派畀你？'}
                </h2>
                <p className="text-yellow-200/70 mb-6">
                  {isGiver ? '選擇派利是對象' : '選擇派利是畀你嘅人'}
                </p>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {RELATIONS.map((relation) => (
                    <label
                      key={relation}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.relation === relation
                          ? 'bg-yellow-500/20 border-yellow-400'
                          : 'bg-red-800/30 border-yellow-500/20 hover:border-yellow-400/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="relation"
                        value={relation}
                        checked={formData.relation === relation}
                        onChange={(e) => updateFormData('relation', e.target.value)}
                        className="w-5 h-5 text-yellow-400 focus:ring-yellow-400"
                      />
                      <span className="text-yellow-100 font-medium text-lg">{relation}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: 派幾錢 */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  {isGiver ? '派幾錢？' : '收到幾錢？'}
                </h2>
                <p className="text-yellow-200/70 mb-6">選擇利是金額</p>

                {/* 預設金額按鈕 */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        updateFormData('amount', amount)
                        updateFormData('customAmount', undefined)
                      }}
                      className={`py-4 px-2 rounded-xl font-bold text-xl transition-all ${
                        formData.amount === amount && !formData.customAmount
                          ? 'bg-yellow-500 text-red-900 scale-105 shadow-lg shadow-yellow-500/50'
                          : 'bg-red-700/50 text-yellow-300 border-2 border-yellow-500/30 hover:border-yellow-400 hover:scale-105'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* 自訂金額 */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    自訂金額（港幣）
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xl font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="輸入金額..."
                      value={formData.customAmount || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || undefined
                        updateFormData('customAmount', value)
                        if (value) {
                          updateFormData('amount', 0)
                        }
                      }}
                      className="w-full pl-10 pr-4 py-4 text-lg bg-red-800/50 border-2 border-yellow-500/30 rounded-xl text-yellow-100 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                    />
                  </div>
                </div>

                {(formData.amount > 0 || formData.customAmount) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-xl"
                  >
                    <p className="text-yellow-200 text-center">
                      利是金額：<span className="text-yellow-300 font-bold text-2xl">
                        ${formData.customAmount || formData.amount}
                      </span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 6: 祝福語 */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">祝福語</h2>
                <p className="text-yellow-200/70 mb-6">選擇或輸入祝福語（可選）</p>

                {/* 快速選擇 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {GREETINGS.map((greeting) => (
                    <button
                      key={greeting}
                      onClick={() => updateFormData('greeting', greeting)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        formData.greeting === greeting
                          ? 'bg-yellow-500 text-red-900'
                          : 'bg-red-700/50 text-yellow-300 border border-yellow-500/30 hover:border-yellow-400'
                      }`}
                    >
                      {greeting}
                    </button>
                  ))}
                </div>

                {/* 自訂祝福語 */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">
                    自訂祝福語
                  </label>
                  <textarea
                    placeholder="輸入你嘅祝福語..."
                    value={formData.greeting}
                    onChange={(e) => updateFormData('greeting', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-red-800/50 border-2 border-yellow-500/30 rounded-xl text-yellow-100 placeholder-yellow-500/50 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Honeypot - 隱藏欄位防機器人 */}
          <input
            type="text"
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Rate limit toast */}
          <AnimatePresence>
            {rateLimitMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mt-4 p-4 bg-orange-500/20 border border-orange-400 rounded-xl flex items-center gap-3"
              >
                <span className="text-2xl">⏳</span>
                <p className="text-orange-200 font-semibold">{rateLimitMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 錯誤訊息 */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-400 rounded-xl"
            >
              <p className="text-red-200 text-center">{submitError}</p>
            </motion.div>
          )}

          {/* 按鈕區域 */}
          <div className="mt-8 flex gap-3">
            {/* 上一步 */}
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-800/50 border-2 border-yellow-500/30 text-yellow-300 font-semibold rounded-xl hover:border-yellow-400 transition-all disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                上一步
              </button>
            )}

            {/* 下一步 / 提交 */}
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 text-red-900 font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/30"
              >
                下一步
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || submitSuccess}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 text-red-900 font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    正在入利是...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle2 size={20} />
                    提交成功！
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    提交
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 底部裝飾 */}
        <div className="mt-8 text-center text-yellow-200/50 text-sm">
          <p>多謝你參與全港利是行情調查 🧧</p>
        </div>
      </main>
    </div>
  )
}
