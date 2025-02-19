import Image from "next/image";

export default function ImageComponent() {
	return (
		<div className="flex items-center justify-center absolute right-2/3 bottom-[40%]">
			<Image
				src="/Running.gif"
				alt="Login illustration"
				property="unoptimized"
				height={200}
				width={200}
				className="max-w-md w-full h-auto"
			/>
		</div>
	);
}
