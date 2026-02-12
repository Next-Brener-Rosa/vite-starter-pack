import {
	ArrowLeftIcon,
	CircleUserRoundIcon,
	LoaderIcon,
	PencilIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Cropper,
	CropperCropArea,
	CropperDescription,
	CropperImage,
} from "@/components/ui/cropper";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

import { useFileUpload } from "@/hooks/use-file-upload";

import { cn } from "@/lib/utils";

type Area = { x: number; y: number; width: number; height: number };

type AvatarUploaderProps = {
	className?: string;
	value: string | null;
	onChange: (file: Blob | null) => void;
	isLoading?: boolean;
	size?: "sm" | "md" | "lg";
};

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area,
	outputWidth: number = pixelCrop.width,
	outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
	try {
		const image = await createImage(imageSrc);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			return null;
		}

		canvas.width = outputWidth;
		canvas.height = outputHeight;

		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			outputWidth,
			outputHeight,
		);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				resolve(blob);
			}, "image/jpeg");
		});
	} catch (error) {
		console.error("Error in getCroppedImg:", error);
		return null;
	}
}

export function AvatarUploader({
	className,
	value,
	onChange,
	isLoading = false,
	size = "md",
}: AvatarUploaderProps) {
	const sizeStyles = {
		sm: {
			button: "size-12",
			icon: "size-3",
			editButton: "size-5",
			editIcon: "size-2",
			pixels: 48,
		},
		md: {
			button: "size-16",
			icon: "size-4",
			editButton: "size-6",
			editIcon: "size-2.5",
			pixels: 64,
		},
		lg: {
			button: "size-20",
			icon: "size-5",
			editButton: "size-7",
			editIcon: "size-3",
			pixels: 80,
		},
	};

	const styles = sizeStyles[size];

	const [
		{ files, isDragging },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/*",
	});

	const previewUrl = files[0]?.preview || null;
	const fileId = files[0]?.id;

	const [finalImageUrl, setFinalImageUrl] = React.useState<string | null>(
		value,
	);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	const previousFileIdRef = React.useRef<string | undefined | null>(null);

	const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
		null,
	);

	const [zoom, setZoom] = React.useState(1);

	const handleCropChange = React.useCallback((pixels: Area | null) => {
		setCroppedAreaPixels(pixels);
	}, []);

	const handleApply = async () => {
		if (!previewUrl || !fileId || !croppedAreaPixels) {
			console.error("Missing data for apply:", {
				previewUrl,
				fileId,
				croppedAreaPixels,
			});

			if (fileId) {
				removeFile(fileId);
				setCroppedAreaPixels(null);
			}
			return;
		}

		try {
			const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);

			if (!croppedBlob) {
				throw new Error("Failed to generate cropped image blob.");
			}

			const newFinalUrl = URL.createObjectURL(croppedBlob);

			if (finalImageUrl) {
				URL.revokeObjectURL(finalImageUrl);
			}

			setFinalImageUrl(newFinalUrl);
			onChange(croppedBlob);

			setIsDialogOpen(false);
		} catch (error) {
			console.error("Error during apply:", error);
			setIsDialogOpen(false);
		}
	};

	React.useEffect(() => {
		const currentFinalUrl = finalImageUrl;

		return () => {
			if (currentFinalUrl && currentFinalUrl.startsWith("blob:")) {
				URL.revokeObjectURL(currentFinalUrl);
			}
		};
	}, [finalImageUrl]);

	React.useEffect(() => {
		if (fileId && fileId !== previousFileIdRef.current) {
			setIsDialogOpen(true);
			setCroppedAreaPixels(null);
			setZoom(1);
		}

		previousFileIdRef.current = fileId;
	}, [fileId]);

	React.useEffect(() => {
		setFinalImageUrl(value);
	}, [value]);

	return (
		<div
			className={cn("flex flex-col items-center gap-2 w-fit", {
				className,
			})}
		>
			<div className="relative inline-flex">
				<button
					type="button"
					className={cn(
						"border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none",
						styles.button,
					)}
					onClick={openFileDialog}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					aria-label={finalImageUrl ? "Change image" : "Upload image"}
					disabled={isLoading}
				>
					{finalImageUrl ? (
						<img
							className="size-full object-cover"
							src={finalImageUrl}
							alt="User avatar"
							width={styles.pixels}
							height={styles.pixels}
							style={{ objectFit: "cover" }}
						/>
					) : (
						<div aria-hidden="true">
							<CircleUserRoundIcon className={cn("opacity-60", styles.icon)} />
						</div>
					)}
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
							<LoaderIcon className="animate-spin text-white" />
						</div>
					)}
				</button>
				{finalImageUrl && (
					<Button
						type="button"
						onClick={openFileDialog}
						size="icon"
						variant="secondary"
						className={cn(
							"border-background focus-visible:border-background absolute -top-1 -right-1 rounded-full border-3 shadow-none",
							styles.editButton,
						)}
						aria-label="Edit image"
						disabled={isLoading}
					>
						<PencilIcon className={styles.editIcon} />
					</Button>
				)}
				<input
					{...getInputProps()}
					className="sr-only"
					aria-label="Upload image file"
					tabIndex={-1}
				/>
			</div>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
					<DialogDescription className="sr-only">
						Recortar imagem para avatar
					</DialogDescription>
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="flex items-center justify-between border-b p-4 text-base">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="-my-1 opacity-60"
									onClick={() => setIsDialogOpen(false)}
									aria-label="Cancel"
								>
									<ArrowLeftIcon aria-hidden="true" />
								</Button>
								<span>Cortar</span>
							</div>
							<Button
								className="-my-1"
								onClick={handleApply}
								disabled={!previewUrl}
								autoFocus
							>
								Aplicar
							</Button>
						</DialogTitle>
					</DialogHeader>
					{previewUrl && (
						<Cropper
							className="h-96 sm:h-120"
							image={previewUrl}
							zoom={zoom}
							onCropChange={handleCropChange}
							onZoomChange={setZoom}
						>
							<CropperDescription />
							<CropperImage />
							<CropperCropArea />
						</Cropper>
					)}
					<DialogFooter className="border-t px-4 py-6">
						<div className="mx-auto flex w-full max-w-80 items-center gap-4">
							<ZoomOutIcon
								className="shrink-0 opacity-60"
								size={16}
								aria-hidden="true"
							/>
							<Slider
								defaultValue={[1]}
								value={[zoom]}
								min={1}
								max={3}
								step={0.1}
								onValueChange={(value) => setZoom(value[0])}
								aria-label="Zoom slider"
							/>
							<ZoomInIcon
								className="shrink-0 opacity-60"
								size={16}
								aria-hidden="true"
							/>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
