'use server'

import { revalidateTag } from 'next/cache'

import { getCurrentOrg } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'
import { updateMember } from '@/http/update-member'
import { Role, roleSchema } from '@saas/auth'
import { revokeInvite } from '@/http/revoke-invite'
import { z } from 'zod'
import { createInvite } from '@/http/create-invite'
import { HTTPError } from 'ky'

const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid e-mail address.' }),
  role: roleSchema,
})

interface ErrorResponse {
  message: string
}

export async function createInviteAction(data: FormData) {
  const currentOrg = getCurrentOrg()!
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, role } = result.data

  try {
    await createInvite({
      org: currentOrg,
      email,
      role,
    })

    revalidateTag(`${currentOrg}/invites`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = (await err.response.json()) as ErrorResponse

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created the invite.',
    errors: null,
  }
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = getCurrentOrg()

  await removeMember({
    org: currentOrg!,
    memberId,
  })

  revalidateTag(`${currentOrg}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = getCurrentOrg()

  await updateMember({
    org: currentOrg!,
    memberId,
    role,
  })

  revalidateTag(`${currentOrg}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = getCurrentOrg()

  await revokeInvite({
    org: currentOrg!,
    inviteId,
  })

  revalidateTag(`${currentOrg}/invites`)
}
