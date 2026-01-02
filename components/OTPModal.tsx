'use client'
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { handleError } from '@/lib/utils'
import Image from 'next/image'
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'

interface OTPModalProps {
  email: string
  accountId: string
}

const OTPModal = (props: OTPModalProps) => {
  const { email, accountId } = props

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 提交验证
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 调用 API 验证 OTP
      const sessionId = await verifySecret({
        accountId,
        password,
      })
      if (sessionId) {
        router.push('/')
      }
      // 验证成功，关闭弹窗
      setIsOpen(false)
    } catch (error) {
      handleError(error, 'OTP 验证失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 重新发送
  const handleResendOTP = async () => {
    // 调用 API 重新发送 OTP
    await sendEmailOTP({ email })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='shad-alert-dialog'>
        {/* header */}
        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            OTP 验证
            <Image
              src='/assets/icons/close-dark.svg'
              alt='close'
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className='otp-close-button'
            />
          </AlertDialogTitle>
          <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
            验证码已发送到
            <span className='pl-2 text-brand'>{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* OTP 输入框部分 */}
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className='shad-otp'>
            <InputOTPSlot index={0} className='shad-otp-slot' />
            <InputOTPSlot index={1} className='shad-otp-slot' />
            <InputOTPSlot index={2} className='shad-otp-slot' />
            <InputOTPSlot index={3} className='shad-otp-slot' />
            <InputOTPSlot index={4} className='shad-otp-slot' />
            <InputOTPSlot index={5} className='shad-otp-slot' />
          </InputOTPGroup>
        </InputOTP>
        {/* footer */}
        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <AlertDialogAction
              className='shad-submit-btn h-12'
              type='button'
              onClick={handleSubmit}
            >
              立即体验
              {isLoading && (
                <Image
                  src='/assets/icons/loader.svg'
                  alt='loader'
                  width={24}
                  height={24}
                  className='animate-spin ml-2'
                />
              )}
            </AlertDialogAction>

            <div className='subtitle mt-2 text-center text-light-200'>
              没有收到验证码？
              <Button
                className='pl-1 text-brand'
                variant='link'
                type='button'
                onClick={handleResendOTP}
              >
                重新发送
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal
