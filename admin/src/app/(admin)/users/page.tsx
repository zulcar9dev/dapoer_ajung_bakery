"use client";

import { Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_USERS } from "@shared/mock-data";

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-primary/10 text-primary border-primary/20",
  STAFF: "bg-info/10 text-info border-info/20",
  KASIR: "bg-warning/10 text-warning border-warning/20",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">User Management</h1><p className="text-sm text-muted-foreground">Kelola akses pengguna dashboard.</p></div>
        <Button className="bg-primary text-primary-foreground"><UserPlus className="h-4 w-4 mr-1" />Tambah User</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {["OWNER", "STAFF", "KASIR"].map((role) => (
          <Card key={role}><CardContent className="pt-6 text-center"><Shield className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">{MOCK_USERS.filter((u) => u.role === role).length}</p><p className="text-sm text-muted-foreground">{role}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Daftar Pengguna</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {MOCK_USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{u.name.charAt(0)}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.phone}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline" className={ROLE_COLORS[u.role] || ""}>{u.role}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={u.isActive ? "text-success border-success/20" : "text-muted-foreground"}>{u.isActive ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
