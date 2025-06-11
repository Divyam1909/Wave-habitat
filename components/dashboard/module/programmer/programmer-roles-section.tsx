"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lock, Users } from "lucide-react"

interface ProgrammerRolesSectionProps {
  module: any
}

export function ProgrammerRolesSection({ module }: ProgrammerRolesSectionProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-wave-lightBlue">Owner</Badge>
      case "programmer":
        return <Badge className="bg-wave-seafoam text-wave-deepBlue">Programmer</Badge>
      case "operator":
        return <Badge className="bg-wave-buttonAuto text-wave-deepBlue">Operator</Badge>
      case "viewer":
        return <Badge className="bg-wave-sand/70 text-wave-deepBlue">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-wave-lightBlue flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Module Roles
            </span>
            <Badge variant="outline" className="bg-wave-deepBlue/50 text-wave-sand border-wave-lightBlue/30">
              <Lock className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-wave-deepBlue/30">
              <TableRow>
                <TableHead className="text-wave-sand">Username</TableHead>
                <TableHead className="text-wave-sand">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {module.roles.map((role: any) => (
                <TableRow key={role.userId} className="border-wave-lightBlue/20">
                  <TableCell className="text-wave-sand">{role.username}</TableCell>
                  <TableCell>{getRoleBadge(role.role)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
