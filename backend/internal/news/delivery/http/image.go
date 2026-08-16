package http

import (
	"bytes"
	"io"

	"github.com/disintegration/imaging"

	// Register WebP decoder (decode-only) so uploaded .webp files can be read.
	_ "golang.org/x/image/webp"
)

const (
	maxCoverWidth  = 1600 // px; downscale wider images for web delivery
	coverJPEGQuali = 82   // JPEG quality for optimized output
)

// optimizeCoverImage decodes an uploaded image (JPEG/PNG/WebP), fixes EXIF
// orientation, downscales overly large images, and re-encodes as an optimized
// JPEG suitable for web delivery. Output is always JPEG bytes.
func optimizeCoverImage(r io.Reader) ([]byte, error) {
	img, err := imaging.Decode(r, imaging.AutoOrientation(true))
	if err != nil {
		return nil, err
	}

	if img.Bounds().Dx() > maxCoverWidth {
		img = imaging.Resize(img, maxCoverWidth, 0, imaging.Lanczos)
	}

	var buf bytes.Buffer
	if err := imaging.Encode(&buf, img, imaging.JPEG, imaging.JPEGQuality(coverJPEGQuali)); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
