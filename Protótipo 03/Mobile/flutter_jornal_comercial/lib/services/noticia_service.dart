import 'dart:convert';

import '../core/constants/api_constants.dart';
import '../models/noticia.dart';
import 'api_service.dart';

class NoticiaService {
  final ApiService _apiService = ApiService();

  Future<List<Noticia>> listarNoticias() async {
    final response = await _apiService.get(
      '${ApiConstants.noticias}/listar',
    );

    print('========== RESPOSTA DAS NOTÍCIAS ==========');
    print(const JsonEncoder.withIndent('  ').convert(response));
    print('============================================');

    final List<dynamic> dados;

    if (response is List) {
      dados = response;
    } else if (response is Map && response['noticias'] is List) {
      dados = response['noticias'];
    } else if (response is Map && response['data'] is List) {
      dados = response['data'];
    } else {
      throw Exception(
        'Formato de resposta das notícias não reconhecido.',
      );
    }

    return dados
        .map(
          (json) => Noticia.fromJson(
            Map<String, dynamic>.from(json),
          ),
        )
        .toList();
  }
}