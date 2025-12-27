import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
export const DashboardCard = ({ title, value, icon, iconColor, trend, delay = 0, onClick }) => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay }, className: `bg-white border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`, onClick: onClick, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: `${iconColor} p-3 rounded-lg`, children: icon }), trend && (_jsxs("div", { className: `flex items-center text-sm ${trend.up ? 'text-green-600' : 'text-red-600'}`, children: [trend.up ? (_jsx(ArrowUpRight, { className: "h-4 w-4 mr-1" })) : (_jsx(ArrowDownRight, { className: "h-4 w-4 mr-1" })), _jsx("span", { children: trend.value })] }))] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: title }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: value })] })] }));
};
