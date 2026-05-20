import face_recognition
import numpy as np
import pickle
import cv2
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

FACE_DATA_PATH = Path(os.getenv("FACE_DATA_PATH", "./face_data"))
TOLERANCE      = float(os.getenv("TOLERANCE", "0.5"))

FACE_DATA_PATH.mkdir(exist_ok=True)


def encode_face_from_image(image_bytes: bytes) -> bytes | None:
    """
    Accepts raw image bytes, returns pickled face encoding or None if no face found.
    """
    nparr  = np.frombuffer(image_bytes, np.uint8)
    img    = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb    = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    locs   = face_recognition.face_locations(rgb)
    encs   = face_recognition.face_encodings(rgb, locs)
    if not encs:
        return None
    return pickle.dumps(encs[0])


def identify_face(frame_bytes: bytes, known_encodings: list[dict]) -> dict | None:
    """
    Given a camera frame and list of {student_id, encoding_bytes},
    returns the matched student dict or None.
    """
    nparr = np.frombuffer(frame_bytes, np.uint8)
    img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb   = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    locs  = face_recognition.face_locations(rgb)
    encs  = face_recognition.face_encodings(rgb, locs)

    if not encs:
        return None

    known_vecs = [pickle.loads(k["encoding"]) for k in known_encodings]
    for face_enc in encs:
        distances = face_recognition.face_distance(known_vecs, face_enc)
        best_idx  = int(np.argmin(distances))
        if distances[best_idx] <= TOLERANCE:
            return known_encodings[best_idx]
    return None


def save_photo(student_id: str, image_bytes: bytes) -> str:
    """Save student photo to disk, return path."""
    path = FACE_DATA_PATH / f"{student_id}.jpg"
    with open(path, "wb") as f:
        f.write(image_bytes)
    return str(path)
