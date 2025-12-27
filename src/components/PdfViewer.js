import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
const PdfViewer = ({ documentActif }) => {
    const iframeRef = useRef(null);
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "aspect-[16/9] min-h-[500px] bg-white rounded-lg overflow-hidden", children: [_jsx("iframe", { ref: iframeRef, src: `${documentActif}#toolbar=1&navpanes=1&scrollbar=1`, className: "w-full h-full", title: "PDF Viewer", style: { border: 'none' } }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", style: { zIndex: 10 }, children: _jsx("div", { className: "text-5xl font-bold text-primary opacity-10 rotate-45 select-none", children: "ISIMemo - Consultation uniquement" }) })] }), _jsx("style", { children: `
        @media print {
          body { display: none; }
        }
      ` })] }));
};
export default PdfViewer;
