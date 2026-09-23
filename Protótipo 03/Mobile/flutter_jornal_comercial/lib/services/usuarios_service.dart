import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../core/constants/api_constants.dart';
import '../models/usuario.dart';
import 'api_service.dart';

class UsuarioService {
  final ApiService _apiService = ApiService();

  Future<int> _obterUsuarioId() async {
    final prefs = await SharedPreferences.getInstance();

    final usuarioId = prefs.getInt('usuarioId');

    if (usuarioId != null) {
      return usuarioId;
    }

    final token = prefs.getString('token');

    if (token == null || token.isEmpty) {
      throw Exception('Usuário não está logado.');
    }

    final partes = token.split('.');

    if (partes.length != 3) {
      throw Exception('Token inválido.');
    }

    try {
      final payload = partes[1];

      final normalizado = base64Url.normalize(payload);

      final dados = jsonDecode(
        utf8.decode(
          base64Url.decode(normalizado),
        ),
      );

      final id = dados['id'];

      if (id == null) {
        throw Exception(
          'ID do usuário não encontrado no token.',
        );
      }

      final usuarioId =
          id is int ? id : int.parse(id.toString());

      await prefs.setInt(
        'usuarioId',
        usuarioId,
      );

      return usuarioId;
    } catch (e) {
      throw Exception(
        'Não foi possível identificar o usuário.',
      );
    }
  }

  Future<Usuario> buscarUsuarioLogado() async {
    final usuarioId = await _obterUsuarioId();

    final response = await _apiService.get(
      '${ApiConstants.usuarios}/buscar/$usuarioId',
    );

    if (response is! Map) {
      throw Exception(
        'Formato de resposta do usuário não reconhecido.',
      );
    }

    return Usuario.fromJson(
      Map<String, dynamic>.from(response),
    );
  }

  Future<Usuario> atualizarUsuario({
    required int usuarioId,
    String? bio,
  }) async {
    final body = <String, dynamic>{};

    if (bio != null) {
      body['bio'] = bio;
    }

    final response = await _apiService.put(
      '${ApiConstants.usuarios}/atualizar/$usuarioId',
      body: body,
    );

    if (response is! Map) {
      throw Exception(
        'Formato de resposta da atualização não reconhecido.',
      );
    }

    final usuario = response['usuario'];

    if (usuario is! Map) {
      throw Exception(
        'Usuário atualizado não encontrado na resposta.',
      );
    }

    return Usuario.fromJson(
      Map<String, dynamic>.from(usuario),
    );
  }
}