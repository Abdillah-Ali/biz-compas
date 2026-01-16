import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SettingsView = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account and preferences</p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal and company details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={user?.name} readOnly className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input value={user?.email} readOnly className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input value={user?.company_name} readOnly className="bg-slate-50" />
                        </div>
                        <Button disabled>Save Changes</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
