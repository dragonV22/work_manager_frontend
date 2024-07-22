import { useState, useRef, useEffect } from "react";
import { CiTrash } from "react-icons/ci";
import PropTypes from "prop-types";

const ImageInput = ({ defaultAvatar, onUpload }) => {
  const [currentImage, setCurrentImage] = useState(defaultAvatar ?? null);

  useEffect(() => {
    setCurrentImage(defaultAvatar);
  }, [defaultAvatar]);

  const fileRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCurrentImage(reader.result);
      };

      reader.readAsDataURL(file);

      if (onUpload) {
        onUpload(file);
      }
    }
  };

  const deleteFile = () => {

    setCurrentImage(null);
    if (fileRef.current) {
      fileRef.current.value = null;
      
    }
    if (onUpload) {
      onUpload(null);
    }
  };

  return (
    <div className="w-full flex flex-wrap justify-end">
      <div className="relative w-full h-40 border-dashed border-[1px] border-slate-500 bg-white mb-1">
        {currentImage && (
          <img
            src={currentImage}
            alt="Profile Avatar"
            className="relative z-20 w-full h-full bg-white"
          />
        )}
        <label className="absolute z-10 top-0 left-0 w-full h-full cursor-pointer">
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative flex flex-col items-center justify-center w-full h-full bg-black bg-opacity-0 hover:bg-opacity-30">
            <p className="text-black text-xl">&#8853;</p>
            <p className="text-blue-500 text-sm">ファイルを選択</p>
          </div>
        </label>
      </div>
      <button
        className="w-max text-slate-500 flex align-center"
        onClick={deleteFile}
      >
        <CiTrash />
        <span className="text-xs">削除</span>
      </button>
    </div>
  );
};

ImageInput.propTypes = {
  defaultAvatar: PropTypes.any,
  onUpload: PropTypes.any,
};

export default ImageInput;
