import { useState } from "react";

export interface FileUploadProps {
  readonly onUploadConfirm: (contents: string[]) => void;
}

export const useController = (props: Readonly<FileUploadProps>) => {
  const { onUploadConfirm } = props;
  const [files, setFiles] = useState<FileList>();

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;

    setFiles(event.target.files);
  };

  const onUploadButtonClick = async () => {
    if (!files?.length) return;

    const contents: string[] = [];

    for (const file of files) {
      const text = await file.text();
      contents.push(text);
    }

    onUploadConfirm(contents);
  };

  return { files, handleFileInputChange, onUploadButtonClick };
};
