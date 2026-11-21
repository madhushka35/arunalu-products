"use client"

import * as React from "react"
import { PencilLine, Trash2 } from "lucide-react"

import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { DataTable } from "@/components/admin/data-table"
import { FormDrawer } from "@/components/admin/form-drawer"
import { AdminPageHeader, IconAction, StatusBadge } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { FieldRow, SelectField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { adminRoles, type AdminUser } from "@/features/admin/sample-data"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Figma "Admin – 16 User Management". Staff accounts only — there is no
 * public customer registration. New users get an invitation email and set
 * their own password (backend); admins never see or set passwords.
 */
export function UsersManager({ users }: { users: AdminUser[] }) {
  const [drawer, setDrawer] = React.useState<{ user: AdminUser | null } | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [toDelete, setToDelete] = React.useState<AdminUser | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const editing = drawer?.user ?? null

  return (
    <>
      <AdminPageHeader
        title="Users"
        subtitle="Admin users only — no customer accounts"
        actions={
          <button
            type="button"
            onClick={() => {
              setErrors({})
              setDrawer({ user: null })
            }}
            className={ctaClassName("primary", "h-11 w-full md:w-auto")}
          >
            Invite user
          </button>
        }
      />
      {notice && <FormBanner kind="warning">{notice}</FormBanner>}
      <DataTable
        caption="Admin users"
        rows={users}
        rowKey={(u) => u.id}
        firstColumnLink={false}
        onCardSelect={(u) => setDrawer({ user: u })}
        columns={[
          { header: "Name", cell: (u) => u.name },
          { header: "Email", desktopOnly: true, cell: (u) => u.email },
          { header: "Role", width: "w-[160px]", cell: (u) => u.role },
          { header: "Status", width: "w-[120px]", desktopOnly: true, cell: (u) => <StatusBadge status={u.status} /> },
          { header: "Last login", width: "w-[140px]", desktopOnly: true, cell: (u) => u.lastLogin },
          {
            header: "Actions",
            width: "w-[112px]",
            cell: (u) => (
              <span className="-my-1.5 flex items-center">
                <IconAction
                  icon={PencilLine}
                  label={`Edit ${u.name}`}
                  onClick={() => {
                    setErrors({})
                    setDrawer({ user: u })
                  }}
                />
                {u.role !== "Super Admin" && <IconAction icon={Trash2} label={`Remove ${u.name}`} danger onClick={() => setToDelete(u)} />}
              </span>
            ),
          },
        ]}
        card={(u) => ({ title: u.name, badge: <StatusBadge status={u.status} />, line1: u.role, line2: u.email, meta: `Last login ${u.lastLogin}` })}
      />

      <FormDrawer
        open={drawer !== null}
        onOpenChange={(o) => !o && setDrawer(null)}
        title={editing ? "Edit user" : "Invite user"}
        submitLabel={editing ? "Save changes" : "Send invitation"}
        onSubmit={(data) => {
          const e: Record<string, string> = {}
          const name = String(data.get("name") ?? "").trim()
          const email = String(data.get("email") ?? "").trim()
          if (!name) e.name = "Enter the person's name"
          if (!EMAIL.test(email)) e.email = "Enter a valid email address"
          else if (users.some((u) => u.email === email.toLowerCase() && u.id !== editing?.id)) e.email = "This email already has an account"
          if (!data.get("role")) e.role = "Choose a role"
          setErrors(e)
          if (Object.keys(e).length) return false
          setNotice(editing ? `Preview only: “${name}” was not updated.` : `Preview only: no invitation was sent to ${email}. Invitations work once the backend is connected.`)
          return true
        }}
      >
        <TextField id="user-name" name="name" label="Full name" required defaultValue={editing?.name} error={errors.name} />
        <TextField id="user-email" name="email" type="email" label="Email" required defaultValue={editing?.email} error={errors.email} />
        <FieldRow>
          <SelectField id="user-role" name="role" label="Role" required placeholder="Select…" defaultValue={editing?.role ?? ""} error={errors.role} options={adminRoles.map((r) => ({ value: r, label: r }))} />
          <SelectField id="user-status" name="status" label="Status" defaultValue={editing?.status ?? "Active"} options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} />
        </FieldRow>
        <p className="text-xs text-ink-muted">
          {editing ? "Password changes are done by the user from their profile." : "The person receives an email to set their own password. Admins never see passwords."}
        </p>
      </FormDrawer>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Remove user?"
        message={`${toDelete?.name} will lose access to the admin panel. This is recorded in the activity log.`}
        confirmLabel="Remove user"
        danger
        onConfirm={() => setNotice(`Preview only: “${toDelete?.name}” was not removed.`)}
      />
    </>
  )
}
