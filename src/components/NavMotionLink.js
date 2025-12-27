import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Ce composant wrapper combine les propriétés de Link avec les animations de motion
const NavMotionLink = ({ to, children, className, onClick }) => {
    return (_jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Link, { to: to, className: className || "", onClick: onClick, children: children }) }));
};
export default NavMotionLink;
