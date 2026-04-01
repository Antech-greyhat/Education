import os
import requests
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity

tinnymce_ns = Namespace('tinnymce', description='AI content generation', path='/auth')

generate_model = tinnymce_ns.model('Generate', {
  'prompt': fields.String(required=True, description='Newsletter prompt')
})

@tinnymce_ns.route('/generate')
class GenerateContent(Resource):
  @jwt_required()
  def post(self):
    admin_id = get_jwt_identity()
    if not admin_id:
      return {"msg": "Unauthorized"}, 401

    data = tinnymce_ns.payload
    prompt = data.get('prompt', '').strip()

    if not prompt:
      return {"msg": "Prompt is required"}, 400

    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
      return {"msg": "Groq API key not configured"}, 500

    response = requests.post(
      "https://api.groq.com/openai/v1/chat/completions",
      headers={
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json"
      },
      json={
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
          {
            "role": "system",
            "content": "You are a newsletter writer. Write professional, engaging HTML newsletter content based on the prompt. Return only the HTML body content, no <html> or <body> tags."
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        "max_tokens": 1024
      }
    )

    if response.status_code != 200:
      return {"msg": "Failed to generate content"}, 500

    content = response.json()['choices'][0]['message']['content']
    return {"content": content}, 200