"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const nextImage = () => {
    setSelectedImage((prev) => images.length > 0 ? (prev + 1) % images.length : 0)
  }

  const prevImage = () => {
    setSelectedImage((prev) => images.length > 0 ? (prev - 1 + images.length) % images.length : 0)
  }

  return (
    <>
      {/* Main Gallery Grid - Responsive layout */}
      <div className="grid grid-cols-4 gap-1 md:gap-2 h-[300px] md:h-[500px]">
        {/* Main Image - Takes up 3 columns on desktop, full width on mobile */}
        <div
          className="col-span-4 md:col-span-3 relative cursor-pointer overflow-hidden bg-muted"
          onClick={() => {
            setSelectedImage(0)
            setIsOpen(true)
          }}
        >
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={title || "Property image"}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>

        {/* Thumbnail Grid - Hidden on mobile, shown on desktop */}
        <div className="hidden md:grid grid-rows-2 gap-2">
          {images.slice(1, 3).map((image, idx) => (
            <div
              key={idx}
              className="relative cursor-pointer overflow-hidden bg-muted rounded-sm"
              onClick={() => {
                setSelectedImage(idx + 1)
                setIsOpen(true)
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} ${idx + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
          {images.length > 3 && (
            <div
              className="relative cursor-pointer overflow-hidden bg-muted rounded-sm"
              onClick={() => setIsOpen(true)}
            >
              <Image src={images[3] || "/placeholder.svg"} alt={`${title} 4`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">+{images.length - 3} more</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Show all images button */}
      <div className="md:hidden p-3 bg-muted/50">
        <Button onClick={() => setIsOpen(true)} variant="outline" className="w-full">
          View All {images.length} Photos
        </Button>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0">
          <DialogTitle className="sr-only">{title} Gallery</DialogTitle>
          <div className="relative h-full w-full bg-black">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={`${title} ${selectedImage + 1}`}
              fill
              className="object-contain"
            />

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 md:right-4 top-2 md:top-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm">
              {selectedImage + 1} / {images.length}
            </div>

            {/* Thumbnail Strip - Desktop only */}
            <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
              <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className={`relative h-16 w-24 flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 ${
                      idx === selectedImage ? "border-white" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
