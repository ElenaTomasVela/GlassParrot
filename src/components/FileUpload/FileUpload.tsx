import { Upload } from "lucide-react";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";
import { Input } from "../Input";
import { useController, type FileUploadProps } from "./FileUpload.controller";

export default function FileUpload(props: FileUploadProps) {
  const { handleFileInputChange, onUploadButtonClick, files } =
    useController(props);

  return (
    <ButtonGroup className="w-1/2">
      <Input
        className="w-fit"
        type="file"
        multiple
        onChange={handleFileInputChange}
        id="file-upload"
        accept="text/plain"
      />
      <Button
        type="button"
        variant="outline"
        onClick={onUploadButtonClick}
        disabled={!files?.length}
      >
        Subir seleccionados
      </Button>
    </ButtonGroup>
  );
}
