"""
Detect the RGB Color from a Webcam using OpenCV
---------------------------------------------------
Click anywhere on the live webcam feed to see the RGB/hex value of that
pixel, along with the closest matching color name.

Run:
    python main.py
Quit:
    press 'q' in the video window
"""

import cv2
import numpy as np

# A modest built-in set of common named colors (BGR order, to match OpenCV).
# Not exhaustive, but enough for a reasonable "closest color name" match
# without needing an external dataset file.
NAMED_COLORS = {
    "Black": (0, 0, 0), "White": (255, 255, 255), "Red": (0, 0, 255),
    "Lime": (0, 255, 0), "Blue": (255, 0, 0), "Yellow": (0, 255, 255),
    "Cyan": (255, 255, 0), "Magenta": (255, 0, 255), "Silver": (192, 192, 192),
    "Gray": (128, 128, 128), "Maroon": (0, 0, 128), "Olive": (0, 128, 128),
    "Green": (0, 128, 0), "Purple": (128, 0, 128), "Teal": (128, 128, 0),
    "Navy": (128, 0, 0), "Orange": (0, 165, 255), "Pink": (203, 192, 255),
    "Brown": (42, 42, 165), "Gold": (0, 215, 255), "Beige": (220, 245, 245),
    "Coral": (80, 127, 255), "Salmon": (114, 128, 250), "Khaki": (140, 230, 240),
    "Turquoise": (208, 224, 64), "Violet": (238, 130, 238), "Indigo": (130, 0, 75),
    "Chocolate": (30, 105, 210), "Crimson": (60, 20, 220), "SkyBlue": (235, 206, 135),
    "SlateGray": (144, 128, 112), "Tan": (140, 180, 210), "Plum": (221, 160, 221),
    "Orchid": (214, 112, 218), "SteelBlue": (180, 130, 70), "Sienna": (45, 82, 160),
    "DarkGreen": (0, 100, 0), "LightGreen": (144, 238, 144), "HotPink": (180, 105, 255),
}


def closest_color_name(bgr):
    b, g, r = int(bgr[0]), int(bgr[1]), int(bgr[2])
    best_name = None
    best_dist = float("inf")
    for name, (cb, cg, cr) in NAMED_COLORS.items():
        dist = (cb - b) ** 2 + (cg - g) ** 2 + (cr - r) ** 2
        if dist < best_dist:
            best_dist = dist
            best_name = name
    return best_name


clicked = False
click_x, click_y = 0, 0


def on_mouse(event, x, y, flags, param):
    global clicked, click_x, click_y
    if event == cv2.EVENT_LBUTTONDOWN:
        clicked = True
        click_x, click_y = x, y


def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: could not open webcam.")
        return

    window_name = "RGB Color Detector"
    cv2.namedWindow(window_name)
    cv2.setMouseCallback(window_name, on_mouse)

    global clicked

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        if clicked:
            cx, cy = min(click_x, w - 1), min(click_y, h - 1)
            b, g, r = frame[cy, cx]
            color_name = closest_color_name((b, g, r))
            hex_code = f"#{r:02X}{g:02X}{b:02X}"

            cv2.circle(frame, (cx, cy), 8, (255, 255, 255), 2)

            label = f"{color_name}  RGB({r},{g},{b})  {hex_code}"
            # background rectangle for readability
            cv2.rectangle(frame, (10, 10), (10 + 9 * len(label), 60), (0, 0, 0), -1)
            cv2.putText(frame, label, (15, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            # color swatch
            cv2.rectangle(frame, (15, 45), (65, 55), (int(b), int(g), int(r)), -1)
        else:
            cv2.putText(
                frame, "Click anywhere on the video to sample a color",
                (15, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2
            )

        cv2.imshow(window_name, frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
