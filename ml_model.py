import numpy as np
from xgboost import XGBClassifier
import pickle

# Sample training data: [Years of Experience, Resume-Job Match Score]
X_train = np.array([[5, 90], [2, 60], [7, 95], [1, 30], [3, 75], [8, 98]])
y_train = np.array([1, 0, 1, 0, 1, 1])  # 1 = Suitable, 0 = Not suitable

# Train the model
model = XGBClassifier()
model.fit(X_train, y_train)

# Save the model
with open("resume_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("Model trained and saved!")

def predict_suitability(experience, match_score):
    """Predict if a candidate is suitable."""
    if match_score < 30:  # New rejection threshold
        return "Not Suitable"
    
    with open("resume_model.pkl", "rb") as file:
        loaded_model = pickle.load(file)
    
    prediction = loaded_model.predict([[experience, match_score]])
    return "Suitable" if prediction[0] else "Not Suitable"

if __name__ == "__main__":
    print(predict_suitability(4, 85))
