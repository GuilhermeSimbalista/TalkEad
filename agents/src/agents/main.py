import os
from flask import Flask, request, jsonify
from crewai import Agent, Task, Crew, Process
from crewai_tools import FileReadTool
from flask_cors import CORS

os.environ["OPENAI_API_KEY"] = "you-key"

file_read_tool = FileReadTool(file_path='C:\\tcc\\agents\\base\\TesteCsv.csv')

tutor_agent = Agent(
    role='Tutor de Alunos',
    goal='Fornecer respostas claras, concisas e humanas para dúvidas acadêmicas.',
    backstory=(
        "Você é um tutor experiente e compreensivo, com amplo conhecimento em várias disciplinas acadêmicas. "
        "Seu objetivo é esclarecer dúvidas de forma amigável, objetiva e direta. Use um tom empático e encorajador, "
        "mantendo sempre a clareza nas suas respostas. Se a pergunta não for de cunho acadêmico, responda gentilmente que "
        "não pode ajudar com a questão."
    ),
    memory=True,
    tools=[],
    model="gpt-4o-mini"
)

secretaria_agent = Agent(
    role='Secretária Administrativa',
    goal=(
        "Fornecer informações administrativas claras e objetiva, sobre a universidade EAD."
    ),
    backstory=(
        "Você é uma secretária administrativa da universidade EAD, conhecida por sua simpatia, objetividade e clareza. Utilize a planilha de dados "
        "para fornecer informações precisas. Caso a informação solicitada não esteja disponível, informe que a universidade não possui dados sobre o curso ou tópico."
    ),
    memory=True,
    tools=[file_read_tool],
    model="gpt-4o-mini"
)


responder_duvidas_task = Task(
    description=(
        "Responda à seguinte dúvida acadêmica: {duvida}. "
        "Use um tom empático e amigável, fornecendo exemplos quando necessário. "
        "Se a pergunta não for acadêmica, informe ao aluno que não pode responder, mas sempre seja educado e compreensivo."
    ),
    expected_output=(
        "Uma resposta curta, humana e compreensível para um estudante, que aborde diretamente a dúvida acadêmica."
    ),
    agent=tutor_agent,
)

responder_duvidas_administrativas_task = Task(
    description=(
        "Responder perguntas administrativas sobre a universidade com base nos dados da planilha, apenas responder oque foi perguntado deixando as perguntas mais diretas."
        "Em situações oportunas utilize um leve marketing para encorajar os alunos para o curso."
        "Pergunta: {pergunta_administrativa}. "
        "Se não houver informações relevantes na planilha, responda que a universidade não possui o curso ou a informação solicitada. "
        "Para perguntas acadêmicas, resposponda: 'Encaminhar ao tutor'."
    ),
    expected_output="Uma resposta clara, objetiva, simpática, sobre o tópico perguntado.",
    tools=[file_read_tool],
    agent=secretaria_agent
)


app = Flask(__name__)

CORS(app)

@app.route('/processar_pergunta', methods=['POST'])
def processar_pergunta():
    data = request.json
    pergunta = data.get('pergunta', '')

    if not pergunta:
        return jsonify({"error": "Pergunta não fornecida"}), 400


    crew = Crew(agents=[secretaria_agent], tasks=[responder_duvidas_administrativas_task], process=Process.sequential)
    resposta_administrativa = crew.kickoff(inputs={'pergunta_administrativa': pergunta})
    resposta_administrativa_str = str(resposta_administrativa)

    if "pergunta acadêmica" in resposta_administrativa_str.lower() or "encaminhar ao tutor" in resposta_administrativa_str.lower():
        crew = Crew(agents=[tutor_agent], tasks=[responder_duvidas_task], process=Process.sequential)
        resposta_tutor = crew.kickoff(inputs={'duvida': pergunta})
        resposta_tutor_str = str(resposta_tutor)
        return jsonify({"resposta": resposta_tutor_str, "agente": "tutor"})

    return jsonify({"resposta": resposta_administrativa_str, "agente": "secretaria"})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "API está ativa"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
