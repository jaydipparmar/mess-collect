const Spinner = ({ size = 'md', className = '' }) => {
    const sizeMap = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
    };

    return (
        <div
            className={`animate-spin rounded-full border-accent border-t-transparent ${sizeMap[size]} ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
};

export const FullPageSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-white/60 text-sm">Loading...</p>
        </div>
    </div>
);

export default Spinner;
