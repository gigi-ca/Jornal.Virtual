import '../core/constants/api_constants.dart';
import '../models/publicacao.dart';
import 'api_service.dart';

class PublicacaoService {
  final ApiService _apiService = ApiService();

  Future<List<Publicacao>> listarPublicacoes() async {
    final response = await _apiService.get(
      '${ApiConstants.publicacoes}/listar',
    );

    dynamic dados = response;

    if (response is Map) {
      dados = response['publicacoes'] ??
          response['data'] ??
          response;
    }

    if (dados is! List) {
      return [];
    }

    return dados
        .map(
          (item) => Publicacao.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  Future<Publicacao> criarPublicacao({
    required String texto,
  }) async {
    final response = await _apiService.post(
      '${ApiConstants.publicacoes}/cadastrar',
      body: {
        'texto': texto,
      },
    );

    return Publicacao.fromJson(
      Map<String, dynamic>.from(response['publicacao']),
    );
  }

  Future<void> curtir(int publicacaoId) async {
    await _apiService.post(
      '${ApiConstants.curtidas}/curtir',
      body: {
        'publicacaoId': publicacaoId,
      },
    );
  }

  Future<void> descurtir(int publicacaoId) async {
    await _apiService.delete(
      '${ApiConstants.curtidas}/descurtir',
      body: {
        'publicacaoId': publicacaoId,
      },
    );
  }

  Future<List<dynamic>> listarComentarios(
    int publicacaoId,
  ) async {
    final response = await _apiService.get(
      '${ApiConstants.comentarios}/publicacao/$publicacaoId',
    );

    if (response is List) {
      return response;
    }

    if (response is Map) {
      return response['comentarios'] ?? [];
    }

    return [];
  }

  Future<void> criarComentario({
    required int publicacaoId,
    required String texto,
    int? comentarioPaiId,
  }) async {
    final body = <String, dynamic>{
      'publicacaoId': publicacaoId,
      'texto': texto,
    };

    if (comentarioPaiId != null) {
      body['comentarioPaiId'] = comentarioPaiId;
    }

    await _apiService.post(
      '${ApiConstants.comentarios}/cadastrar',
      body: body,
    );
  }

  Future<void> excluirComentario(int comentarioId) async {
    await _apiService.delete(
      '${ApiConstants.comentarios}/$comentarioId',
    );
  }

  Future<List<dynamic>> listarRankingHashtags() async {
    final response = await _apiService.get(
      '${ApiConstants.hashtags}/ranking',
    );

    if (response is List) {
      return response;
    }

    if (response is Map) {
      return response['ranking'] ??
          response['hashtags'] ??
          [];
    }

    return [];
  }

  Future<List<Publicacao>> listarPublicacoesPorHashtag(
    String nome,
  ) async {
    final response = await _apiService.get(
      '${ApiConstants.hashtags}/publicacoes/${Uri.encodeComponent(nome)}',
    );

    if (response is! List) {
      return [];
    }

    return response
        .map(
          (item) => Publicacao.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }
}