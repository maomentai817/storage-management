'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Image from 'next/image'
import Link from 'next/link'

type FormType = 'sign-in' | 'sign-up'

interface AuthFormProps {
  type: FormType
}

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
  })
}

const AuthForm = (props: AuthFormProps) => {
  const { type } = props

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 表单验证
  const formSchema = authFormSchema(type)

  // 表单定义
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  })
  // 提交处理
  const onSubmit = async (valurs: z.infer<typeof formSchema>) => {
    console.log(valurs)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
          <h1 className='form-title'>{type === 'sign-in' ? '登录' : '注册'}</h1>
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <div className='shad-form-item'>
                    <FormLabel className='shad-form-label'>用户名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your full name'
                        className='shad-input'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='shad-form-message' />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <div className='shad-form-item'>
                  <FormLabel className='shad-form-label'>邮箱</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your email'
                      className='shad-input'
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className='shad-form-message' />
              </FormItem>
            )}
          />
          {/* 提交 */}
          <Button
            type='submit'
            className='form-submit-button'
            disabled={isLoading}
          >
            {type === 'sign-in' ? '登录' : '注册'}
            {isLoading && (
              <Image
                src='/assets/icons/loader.svg'
                alt='loader'
                width={24}
                height={24}
                className='ml-2 animate-spin'
              />
            )}
          </Button>
          {/* 错误信息 */}
          {errorMessage && <p className='error-message'>{errorMessage}</p>}

          {/* 登录/注册切换 */}
          <div className='body-2 flex justify-center'>
            <p className='text-light-100'>
              {type === 'sign-in' ? '没有账号？' : '已经有账号？'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className='ml-1 font-medium text-brand'
            >
              {' '}
              {type === 'sign-in' ? '注册' : '登录'}
            </Link>
          </div>
        </form>
      </Form>
      {/* OPT 验证 */}
    </>
  )
}

export default AuthForm
