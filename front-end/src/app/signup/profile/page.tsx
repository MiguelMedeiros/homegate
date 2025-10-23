"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProfile } from "@/contexts/ProfileContext";
import { pubkyService, PubkyErrorInfo } from "@/lib/pubky";

// Zod validation schema
const profileSchema = z.object({
  name: z.string().min(1, "Name must have at least 1 character"),
  avatar: z.any().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PubkyErrorInfo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    // Reset file input
    const fileInput = document.getElementById("avatar-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create user with Pubky SDK
      const result = await pubkyService.createUser({
        name: data.name,
        avatar: avatarPreview,
      });
      
      // Store the result
      
      // Save profile to context
      setProfile({
        name: data.name,
        avatar: avatarPreview,
      });
      
      // Store Pubky data in localStorage for backup page
      try {
        localStorage.setItem("pubky_signup_data", JSON.stringify({
          publicKey: result.publicKey,
          seedPhrase: result.seedPhrase,
          // Note: keypair and session can't be serialized
        }));
      } catch (error) {
        console.error("Error storing Pubky data:", error);
      }
      
      // Navigate to backup page with the generated data
      router.push("/signup/backup");
    } catch (err) {
      console.error("Pubky user creation failed:", err);
      console.error("Error type:", typeof err);
      console.error("Error details:", err);
      setError(err as PubkyErrorInfo);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // Re-trigger form submission
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/5 via-transparent to-brand/10" />
      
      <Header 
        rightContent={
          <Link href="/signup/free">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Back
            </Button>
          </Link>
        }
      />

      {/* Main Content */}
      <main className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 mx-auto">
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            Free Plan - Create Profile
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            create your profile
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            Choose a name and avatar for your Pubky identity
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-brand/20">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-all hover:bg-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="avatar-input"
                    className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-dashed border-brand/20 bg-card/30 transition-all hover:border-brand/50 hover:bg-card/50"
                  >
                    <svg className="h-10 w-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="mt-2 text-xs text-muted-foreground">Add Avatar</span>
                  </label>
                )}
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Optional • Max 5MB • JPG, PNG, GIF
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="mb-3 block text-left text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={`w-full h-14 rounded-xl border-2 bg-background px-4 text-sm outline-none transition-all ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-border/50 focus:border-brand/50"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground text-left">
                This is your display name on Pubky
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-xl border-2 border-red-500/20 bg-red-500/5 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-500">Error</h3>
                    <p className="mt-1 text-sm text-red-400">{error.message}</p>
                    {error.retryable && (
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="sm"
                        className="mt-3 border-red-500/20 text-red-500 hover:border-red-500/50 hover:bg-red-500/5"
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-14 bg-brand text-background text-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background/20 border-t-background"></div>
                  Creating Profile...
                </>
              ) : (
                <>
                  Continue
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

