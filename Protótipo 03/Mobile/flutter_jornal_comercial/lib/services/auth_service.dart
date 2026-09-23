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

    if (response['token'] != null) {
      final token = response['token'];

      await prefs.setString('token', token);

      final usuario = _decodificarToken(token);

      if (usuario != null) {
        if (usuario['id'] != null) {
          await prefs.setInt(
            'usuarioId',
            usuario['id'],
          );
        }

        response['usuario'] = usuario;
      }
    }

    return Map<String, dynamic>.from(response);
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

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove('token');
    await prefs.remove('usuarioId');
  }
}