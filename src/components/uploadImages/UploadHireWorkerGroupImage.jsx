import AnimatedImageUpload from "./AnimatedImageUpload";

function UploadHireWorkerGroupImage({ onClose, onUploadSuccess }) {
    return (
        <AnimatedImageUpload
            title="Hire Worker Group Image"
            uploadEndpoint="/api/file/hire-worker-group"
            onClose={onClose}
            onUploadSuccess={onUploadSuccess}
        />
    );
}

export default UploadHireWorkerGroupImage;