from ultralytics import YOLO

# Load a model
model = YOLO("yolo26n.pt")  # load a pretrained model (recommended for training)

# Train the model
results = model.train(data="GlobalWheat2020.yaml", epochs=100, imgsz=640)
