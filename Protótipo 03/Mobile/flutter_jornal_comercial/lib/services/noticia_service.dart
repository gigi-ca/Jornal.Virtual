import '../models/noticia.dart';
import 'api_service.dart';

class NewsService {
  final ApiService _apiService = ApiService();

  Future<List<Noticia>> listarNoticias() async {
    final response = await _apiService.get('/noticias/listar');

    if (response is! List) {
      throw Exception('Formato de notícias inválido.');
    }

    return response
        .map((item) => Noticia.fromJson(item))
        .toList();
  }
}