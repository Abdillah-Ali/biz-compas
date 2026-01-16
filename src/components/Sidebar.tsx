import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutGrid,
    Menu,
    LogOut,
    Briefcase,
    History,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) {
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutGrid },
        { id: 'businesses', label: 'My Businesses', icon: Briefcase },
        { id: 'transactions', label: 'My Transactions', icon: History },
    ];

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-50 h-screen bg-[#E4E4E5] border-r border-slate-300/50 transition-all duration-300 flex flex-col shadow-sm',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header / Altas Branding Section */}
            <div className="h-20 flex items-center px-6 border-b border-slate-300/30">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                        <ShieldCheck className="text-white h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                                Altas
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                                {user?.name || 'Personal Portfolio'}
                            </span>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(true)}
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-white/50 ml-auto rounded-lg"
                    >
                        <Menu size={20} />
                    </Button>
                )}
            </div>

            {/* Collapsed Toggle (Visible only when collapsed) */}
            {isCollapsed && (
                <div className="flex justify-center py-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(false)}
                        className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-white/50 rounded-xl"
                    >
                        <Menu size={24} />
                    </Button>
                </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative',
                            activeTab === item.id
                                ? 'bg-white text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                                : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                        )}
                    >
                        <item.icon
                            size={22}
                            strokeWidth={activeTab === item.id ? 2.5 : 2}
                            className={cn(
                                'transition-transform duration-300 group-hover:scale-110',
                                isCollapsed && 'mx-auto'
                            )}
                        />
                        {!isCollapsed && (
                            <span className={cn(
                                "text-sm font-semibold tracking-tight transition-colors",
                                activeTab === item.id ? "text-slate-900" : "text-slate-600"
                            )}>
                                {item.label}
                            </span>
                        )}

                        {activeTab === item.id && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-slate-900 rounded-r-full" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom Section: Logout Only */}
            <div className="p-4 border-t border-slate-300/30">
                <button
                    onClick={logout}
                    className={cn(
                        'w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group',
                        'text-slate-600 hover:bg-red-50 hover:text-red-600',
                        isCollapsed && 'justify-center'
                    )}
                >
                    <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors shrink-0">
                        <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    {!isCollapsed && <span className="text-sm font-semibold">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
