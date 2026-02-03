const ScrollRow = ({ children }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {children}
        </div>
    );
};

export default ScrollRow;
