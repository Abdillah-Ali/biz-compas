import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from './UserNav';
import { Button } from '@/components/ui/button';
import { DashboardView } from './DashboardView';
import { BusinessesView } from './BusinessesView';
import { TransactionsView } from './TransactionsView';
import { SettingsView } from './SettingsView';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

export function DashboardLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const handleTabChange = (e: any) => {
            if (e.detail) {
                setActiveTab(e.detail);
            }
        };

        window.addEventListener('changeTab', handleTabChange);
        return () => window.removeEventListener('changeTab', handleTabChange);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView />;
            case 'businesses':
                return <BusinessesView />;
            case 'transactions':
                return <TransactionsView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <DashboardView />;
        }
    };

    const handleHelpClick = () => {
        toast({
            title: "Help Center",
            description: "Need assistance? Our support team is ready to help you manage your finances.",
        });
    };

    const handleNotificationClick = () => {
        toast({
            title: "Notifications",
            description: "You have no new notifications at this time.",
        });
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-white flex">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                {/* Main Content Wrapper */}
                <main
                    className={cn(
                        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
                        isSidebarCollapsed ? "ml-20" : "ml-64"
                    )}
                >
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8">
                        <div className="flex-1 max-w-md relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            <Input
                                placeholder="Search transactions, businesses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 bg-slate-100 border-none focus-visible:ring-2 focus-visible:ring-slate-200 h-11 rounded-2xl w-full transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleNotificationClick}
                                        className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        <Bell size={20} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Notifications</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleHelpClick}
                                        className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        <HelpCircle size={20} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Help Center</p>
                                </TooltipContent>
                            </Tooltip>

                            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

                            <UserNav onSettingsClick={() => setActiveTab('settings')} />
                        </div>
                    </header>

                    <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}
