"use client"

import * as React from "react"
import { Lock } from "lucide-react"

import { FormDrawer } from "@/components/admin/form-drawer"
import { AdminPageHeader, Panel } from "@/components/admin/ui"
import { ctaClassName } from "@/components/public/cta-link"
import { TextareaField, TextField } from "@/components/public/forms/fields"
import { FormBanner } from "@/components/public/forms/form-banner"
import { Checkbox } from "@/components/ui/checkbox"
import { adminRoles, adminUsers, permissionActions, permissionModules, rolePermissions, type AdminRole } from "@/features/admin/sample-data"
import { cn } from "@/lib/utils"

/**
 * Figma "Admin – 17 Roles & Permissions": role list + permission matrix.
 * The UI only edits the matrix; every admin API request is authorised on the
 * server (Laravel policies) — hiding buttons is not security.
 */
export function RolesManager() {
  const [role, setRole] = React.useState<AdminRole>("Sales Manager")
  const [matrix, setMatrix] = React.useState(rolePermissions)
  const [drawer, setDrawer] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const locked = role === "Super Admin"
  const count = (r: AdminRole) => adminUsers.filter((u) => u.role === r).length

  function toggle(module: (typeof permissionModules)[number], i: number, on: boolean) {
    setMatrix((m) => {
      const row = [...m[role][module]] as [number, number, number, number]
      row[i] = on ? 1 : 0
      if (i > 0 && on) row[0] = 1 // create / edit / delete need view
      if (i === 0 && !on) row.fill(0)
      return { ...m, [role]: { ...m[role], [module]: row } }
    })
  }

  return (
    <>
      <AdminPageHeader
        title="Roles & permissions"
        subtitle="Sample roles — adjust to Arunalu Products’ team"
        actions={
          <>
            <button type="button" onClick={() => {
                setError(null)
                setDrawer(true)
              }} className={ctaClassName("outline", "h-11 flex-1 md:flex-none")}>
              Create role
            </button>
            <button type="button" onClick={() => setNotice(`Preview only: permissions for “${role}” were not saved.`)} className={ctaClassName("primary", "h-11 flex-1 md:flex-none")}>
              Save permissions
            </button>
          </>
        }
      />
      {notice && <FormBanner kind="warning">{notice}</FormBanner>}

      <div className="flex flex-col gap-4 md:gap-5 xl:flex-row xl:items-start xl:gap-6">
        <Panel className="min-w-0 p-2 xl:w-[300px] xl:shrink-0">
          <ul role="listbox" aria-label="Roles" className="flex gap-1 overflow-x-auto [scrollbar-width:none] xl:flex-col">
            {adminRoles.map((r) => (
              <li key={r} className="shrink-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={r === role}
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between gap-4 rounded-md px-3.5 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-teal/50",
                    r === role ? "bg-teal/10 font-medium text-navy" : "text-ink hover:bg-surface"
                  )}
                >
                  {r}
                  <span className="text-xs whitespace-nowrap text-ink-muted">
                    {count(r)} user{count(r) === 1 ? "" : "s"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {locked && (
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <Lock aria-hidden className="size-4" /> Super Admin always has every permission.
            </p>
          )}
          <div className="relative overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[520px] text-left">
              <caption className="sr-only">Permissions for {role}</caption>
              <thead className="border-b border-line bg-surface">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    Module · {role}
                  </th>
                  {permissionActions.map((a) => (
                    <th key={a} scope="col" className="w-[76px] px-2 py-3 text-center text-xs font-semibold tracking-wide text-ink-muted uppercase">
                      {a}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionModules.map((m) => (
                  <tr key={m} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-2 text-sm font-medium text-navy">
                      {m}
                    </th>
                    {permissionActions.map((a, i) => (
                      <td key={a} className="px-2 py-1 text-center">
                        <label className="inline-flex size-11 cursor-pointer items-center justify-center has-disabled:cursor-not-allowed">
                          <span className="sr-only">
                            {a} {m}
                          </span>
                          <Checkbox checked={Boolean(matrix[role][m][i])} disabled={locked} onCheckedChange={(v) => toggle(m, i, Boolean(v))} />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-muted">Create, edit and delete include view. The server checks these permissions on every request.</p>
        </div>
      </div>

      <FormDrawer
        open={drawer}
        onOpenChange={setDrawer}
        title="Create role"
        submitLabel="Create role"
        onSubmit={(data) => {
          const name = String(data.get("name") ?? "").trim()
          const err = !name ? "Enter a role name" : adminRoles.some((r) => r.toLowerCase() === name.toLowerCase()) ? "This role already exists" : null
          setError(err)
          if (err) return false
          setNotice(`Preview only: role “${name}” was not created.`)
          return true
        }}
      >
        <TextField id="role-name" name="name" label="Role name" required error={error ?? undefined} />
        <TextareaField id="role-description" name="description" label="Description" maxLength={200} className="[&_textarea]:min-h-[88px]" />
        <p className="text-xs text-ink-muted">New roles start with no permissions.</p>
      </FormDrawer>
    </>
  )
}
