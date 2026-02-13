import AnimatedImageUpload from "./AnimatedImageUpload";

function UploadHireWorkerImage({ onClose, onUploadSuccess }) {
    return (
        <AnimatedImageUpload
            title="Hire Worker Image"
            uploadEndpoint="/api/file/hire-worker"
            onClose={onClose}
            onUploadSuccess={onUploadSuccess}
        />
    );
}

export default UploadHireWorkerImage;