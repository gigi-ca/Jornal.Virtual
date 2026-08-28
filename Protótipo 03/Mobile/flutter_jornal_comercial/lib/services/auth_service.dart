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
      await prefs.setString(
        'token',
        response['token'],
      );
    }

    if (response['usuario'] != null) {
      final usuario = response['usuario'];

      if (usuario['id'] != null) {
        await prefs.setInt(
          'usuarioId',
          usuario['id'],
        );
      }
    }

    return Map<String, dynamic>.from(response);
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