
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../core/constants/api_constants.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> login({
    required String email,
    required String senha,
  }) async {
    final response = await _apiService.post(
      ApiConstants.login,
      body: {
        'email': email,
        'senha': senha,
      },
    );

    final prefs = await SharedPreferences.getInstance();

    final token = response['token'];

    if (token == null || token.toString().isEmpty) {
      throw Exception('Token não recebido pelo servidor.');
    }

    // Salva o token
    await prefs.setString(
      'token',
      token.toString(),
    );

    // Salva o email
    await prefs.setString(
      'email',
      email,
    );

    // Decodifica as informações que o backend colocou no JWT
    final dadosToken = _decodificarToken(
      token.toString(),
    );

    if (dadosToken != null) {
      // Salva o ID do usuário
      if (dadosToken['id'] != null) {
        await prefs.setInt(
          'usuarioId',
          dadosToken['id'],
        );
      }

      // Salva o nome
      if (dadosToken['nome'] != null) {
        await prefs.setString(
          'usuarioNome',
          dadosToken['nome'].toString(),
        );
      }

      // Salva o tipo do usuário
      if (dadosToken['tipo'] != null) {
        await prefs.setString(
          'usuarioTipo',
          dadosToken['tipo'].toString(),
        );
      }

      // Salva a empresa
      if (dadosToken['empresaId'] != null) {
        await prefs.setInt(
          'empresaId',
          dadosToken['empresaId'],
        );
      }
    }

    // Cria um objeto usuario para manter compatibilidade
    // caso alguma parte do aplicativo precise de response['usuario'].
    final usuario = <String, dynamic>{
      'id': dadosToken?['id'],
      'nome': dadosToken?['nome'],
      'tipo': dadosToken?['tipo'],
      'empresaId': dadosToken?['empresaId'],
    };

    return {
      ...Map<String, dynamic>.from(response),
      'usuario': usuario,
    };
  }

  Map<String, dynamic>? _decodificarToken(String token) {
    try {
      final partes = token.split('.');

      if (partes.length != 3) {
        return null;
      }

      final payload = partes[1];

      final normalized = base64Url.normalize(payload);

      final decoded = utf8.decode(
        base64Url.decode(normalized),
      );

      return Map<String, dynamic>.from(
        jsonDecode(decoded),
      );
    } catch (e) {
      print('Erro ao decodificar token: $e');
      return null;
    }
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();

    final token = prefs.getString('token');

    return token != null && token.isNotEmpty;
  }

  Future<String?> getEmail() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getString('email');
  }

  Future<int?> getUsuarioId() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getInt('usuarioId');
  }

  Future<String?> getUsuarioNome() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getString('usuarioNome');
  }

  Future<String?> getUsuarioTipo() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getString('usuarioTipo');
  }

  Future<int?> getEmpresaId() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getInt('empresaId');
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove('token');
    await prefs.remove('email');
    await prefs.remove('usuarioId');
    await prefs.remove('usuarioNome');
    await prefs.remove('usuarioTipo');
    await prefs.remove('empresaId');
    await prefs.remove('historico_noticias');
  }
}
