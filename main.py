from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import json

app = Flask(__name__)
CORS(app)

id= 0
chamados = []

# Rota para listar todos os usuários
@app.route('/lista', methods=['GET'])
def lista_chamados():
    return jsonify(chamados)


# Rota para obter um usuário pelo código junto com a descrição
@app.route('/<string:cpf>', methods=['GET'])
def get_chamados(cpf):
  lista_chamados_cpf = []
  for chamado in chamados:
    if chamado['cpf'] == cpf:
      lista_chamados_cpf.append(chamado)
  else:
    #SE A LISTA ESTIVER CHEIA
    if lista_chamados_cpf:
      return jsonify(lista_chamados_cpf)
    #SE A LISTA ESTIVER VAZIA
    else:
      return jsonify({"error": "Chamado não encontrado nesse cpf"}), 404
  


# Rota para adicionar um novo usuário
@app.route('/novo', methods=['POST'])
def add_chamado():
  global id
  id += 1
  nome_usuario = request.form['nome']
  cpf_usuario = request.form['cpf']
  setor_usuario = request.form['setor']
  descricao_usuario = request.form['descricao'] 
  data_atual = datetime.datetime.now()
  dia = str(data_atual.day)
  mes = str(data_atual.month)
  ano = str(data_atual.year)
  data = dia+"/"+mes+"/"+ano  

  novo_chamado = {"id": id,
                  "cpf": cpf_usuario,
                  "setor": setor_usuario, 
                  "nome": nome_usuario, 
                  "descricao": descricao_usuario, 
                  "status": True,
                  "data": data,
                  "comentario": ""
                  }
  chamados.append(novo_chamado)
  return jsonify({"message": "Chamado cadastrado"}), 201

     

# Rota para alterar informações do usuário
@app.route('/editar/<int:id>', methods=['PUT'])
def alterar(id):
  comentario_json = request.get_json() 
  comentario = comentario_json['comentario']
  for chamado in chamados:
    if chamado['id'] == id:
      chamado['status']= False
      chamado['comentario']= comentario
      return jsonify({"message": "Alterações realizadas"}), 201
  return jsonify({"message": "Usuário não encontrado"}), 404

  
  

# Rota para excluir um Chamado
@app.route('/deletar/<int:id>', methods=['DELETE'])
def deletar_chamado(id):
  for chamado in chamados:
    if chamado['id'] == id:
      chamados.remove(chamado)
      return jsonify({'message': 'Chamado deletado com sucesso'}), 200
  else:
    return jsonify({'error': 'Chamado não encontrado'}), 404
          
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
