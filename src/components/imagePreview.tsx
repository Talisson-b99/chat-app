import { UserCircle2 } from "lucide-react";
import { useMemo } from "react";

interface ImagePreviewProps {
  files: File[] | null;
}

const ImagePreview = ({ files }: ImagePreviewProps) => {
  const previewImage = useMemo(() => {
    if (files === null) {
      return null;
    }
    return URL.createObjectURL(files[0]);
  }, [files]);

  if (previewImage === null) {
    return (
      <div className="flex size-20 items-center justify-center rounded-full bg-cyan-500/20">
        <UserCircle2 className="text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <img
        src={previewImage}
        alt="Preview"
        className="size-16 rounded-full object-cover"
      />
    </div>
  );
};

export default ImagePreview;
