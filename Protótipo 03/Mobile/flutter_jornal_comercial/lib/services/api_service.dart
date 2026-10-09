import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../core/constants/api_constants.dart';

class ApiService {
  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();

    final token = prefs.getString('token');

    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null && token.isNotEmpty)
        'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> get(String endpoint) async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}$endpoint'),
      headers: await _getHeaders(),
    );

    return _handleResponse(response);
  }

  Future<dynamic> post(
    String endpoint, {
    Map<String, dynamic>? body,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}$endpoint'),
      headers: await _getHeaders(),
      body: body != null ? jsonEncode(body) : null,
    );

    return _handleResponse(response);
  }

  Future<dynamic> put(
    String endpoint, {
    Map<String, dynamic>? body,
  }) async {
    final response = await http.put(
      Uri.parse('${ApiConstants.baseUrl}$endpoint'),
      headers: await _getHeaders(),
      body: body != null ? jsonEncode(body) : null,
    );

    return _handleResponse(response);
  }

  Future<dynamic> delete(
    String endpoint, {
    Map<String, dynamic>? body,
  }) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.baseUrl}$endpoint'),
      headers: await _getHeaders(),
      body: body != null ? jsonEncode(body) : null,
    );

    return _handleResponse(response);
  }

  Future<dynamic> uploadArquivo(
    String endpoint,
    List<int> bytes,
    String nomeArquivo,
  ) async {
    final prefs = await SharedPreferences.getInstance();

    final token = prefs.getString('token');

    final request = http.MultipartRequest(
      'POST',
      Uri.parse(
        '${ApiConstants.baseUrl}$endpoint',
      ),
    );

    request.headers['Accept'] = 'application/json';

    if (token != null && token.isNotEmpty) {
      request.headers['Authorization'] =
          'Bearer $token';
    }

    final extensao = nomeArquivo
        .split('.')
        .last
        .toLowerCase();

    MediaType? tipoArquivo;

    switch (extensao) {
      case 'jpg':
      case 'jpeg':
        tipoArquivo = MediaType(
          'image',
          'jpeg',
        );
        break;

      case 'png':
        tipoArquivo = MediaType(
          'image',
          'png',
        );
        break;

      case 'webp':
        tipoArquivo = MediaType(
          'image',
          'webp',
        );
        break;

      case 'mp4':
        tipoArquivo = MediaType(
          'video',
          'mp4',
        );
        break;

      case 'webm':
        tipoArquivo = MediaType(
          'video',
          'webm',
        );
        break;

      case 'mkv':
        tipoArquivo = MediaType(
          'video',
          'x-matroska',
        );
        break;
    }

    request.files.add(
      http.MultipartFile.fromBytes(
        'arquivo',
        bytes,
        filename: nomeArquivo,
        contentType: tipoArquivo,
      ),
    );

    final streamedResponse =
        await request.send();

    final response =
        await http.Response.fromStream(
      streamedResponse,
    );

    return _handleResponse(response);
  }

  dynamic _handleResponse(
    http.Response response,
  ) {
    dynamic data;

    if (response.body.isNotEmpty) {
      try {
        data = jsonDecode(response.body);
      } catch (_) {
        data = response.body;
      }
    }

    if (response.statusCode >= 200 &&
        response.statusCode < 300) {
      return data;
    }

    if (data is Map &&
        data['mensagem'] != null) {
      throw Exception(
        data['mensagem'],
      );
    }

    if (data is Map &&
        data['erro'] != null) {
      throw Exception(
        data['erro'],
      );
    }

    throw Exception(
      'Erro ${response.statusCode}: '
      '${response.reasonPhrase}',
    );
  }
}