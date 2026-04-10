'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { InputField } from '@/components/ui/inputField/InputField'

const VERIFY_MAIL_MUTATION = gql`
  mutation VerifyMail($mail: VerifyMailInput!) {
    verifyMail(mail: $mail)
  }
`

export default function VerifyMailPage() {
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const [verifyMail, { loading }] = useMutation(VERIFY_MAIL_MUTATION)

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the code from your email')
      return
    }

    try {
      await verifyMail({
        variables: {
          mail: { otp },
        },
      })

      toast.success('Email verified successfully!')
      router.push('/login')
    } catch {
      toast.error('Invalid or expired code')
    }
  }

  return (
    <div className="bg-background flex justify-center px-4">
      <div className="border-input-border/40 bg-surface w-full max-w-md rounded-2xl border p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-text-primary text-2xl font-bold">
            Verify your email
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            Enter the code sent to your email address
          </p>
        </div>

        <InputField
          inputId="otp"
          name="otp"
          label="Verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center text-lg tracking-widest"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-primary mt-6 w-full rounded-lg px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Verifying...' : 'Verify email'}
        </button>

        <p className="text-text-secondary mt-4 text-center text-xs">
          Didn’t receive the code? Check your spam folder.
        </p>
      </div>
    </div>
  )
}
