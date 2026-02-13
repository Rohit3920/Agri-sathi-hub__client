import AnimatedImageUpload from "./AnimatedImageUpload";

function UploadMachineRentalImage({ onClose, onUploadSuccess }) {
    return (
        <AnimatedImageUpload
            title="Machine Rental Image"
            uploadEndpoint="/api/file/machine-rental"
            onClose={onClose}
            onUploadSuccess={onUploadSuccess}
        />
    );
}

export default UploadMachineRentalImage;

