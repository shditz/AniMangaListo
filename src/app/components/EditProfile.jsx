"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";

export default function EditProfile({ user, onClose }) {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });
  const [preview, setPreview] = useState(user?.image || "");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError("File size should not exceed 5MB");
          return;
        }

        setFile(file);
        setPreview(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, image: "" }));
        setError("");
      }
    },
  });

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let imageUrl = formData.image;

      if (file) {
        const CLOUDINARY_PRESET = "nextjs_profile_upload";
        const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        const uniqueFileName = `${Date.now()}-${file.name}`;
        const renamedFile = new File([file], uniqueFileName, {
          type: file.type,
        });

        const formDataUpload = new FormData();
        formDataUpload.append("file", renamedFile);
        formDataUpload.append("upload_preset", CLOUDINARY_PRESET);
        formDataUpload.append("cloud_name", CLOUD_NAME);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Error:", errorText);
          throw new Error("Failed Upload Image");
        }

        const uploaded = await uploadResponse.json();
        imageUrl = uploaded.secure_url;
      }

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to Save Changes");
      }

      await update({
        ...session,
        user: {
          ...session.user,
          name: result.data.name,
          image: result.data.image,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black/80 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-purple-950 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Image
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                isDragActive
                  ? "border-purple-500 bg-purple-900/20"
                  : "border-gray-600 hover:border-purple-500"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop images here...</p>
              ) : (
                <p>Drag & drop images, or click to select</p>
              )}
            </div>

            {preview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}

            <div className="mt-4">
              <input
                type="text"
                placeholder="Atau masukkan URL gambar"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setFile(null);
                  if (isValidUrl(e.target.value)) {
                    setPreview(e.target.value);
                  }
                }}
                className="w-full bg-purple-950 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-purple-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
