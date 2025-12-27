import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export const getDashboardProfesseurBaseCards = (delay = 0, navigate) => {
    // No dashboard cards for base professor - removed sujets and disponibilites
    return [];
};
export const DashboardProfesseurBase = ({ delay = 0 }) => {
    const navigate = useNavigate();
    const cards = getDashboardProfesseurBaseCards(delay, navigate);
    return _jsx(_Fragment, { children: cards });
};
