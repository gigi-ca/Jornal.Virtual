import '../models/publicacao.dart';
import 'api_service.dart';

class PublicacaoService {
  final ApiService _apiService = ApiService();

  Future<List<Publicacao>> listarPublicacoes() async {
    final response = await _apiService.get(
      '/publicacoes/listar',
    );

    if (response is! List) {
      throw Exception(
        'Formato de publicações inválido.',
      );
    }

    return response
        .map(
          (item) => Publicacao.fromJson(
            Map<String, dynamic>.from(item),
          ),
        )
        .toList();
  }

  Future<Publicacao> buscarPublicacao(
    int id,
  ) async {
    final response = await _apiService.get(
      '/publicacoes/buscar/$id',
    );

    return Publicacao.fromJson(
      Map<String, dynamic>.from(response),
    );
  }

  Future<int> criarPublicacao({
    required String texto,
  }) async {
    final response = await _apiService.post(
      '/publicacoes/cadastrar',
      body: {
        'texto': texto,
      },
    );

    final publicacao =
        response['publicacao'];

    if (publicacao == null ||
        publicacao['id'] == null) {
      throw Exception(
        'Não foi possível obter o ID da publicação.',
      );
    }

    return int.parse(
      publicacao['id'].toString(),
    );
  }

  Future<void> adicionarMidia(
    int publicacaoId,
    String caminhoArquivo,
  ) async {
    await _apiService.uploadArquivo(
      '/midias-publicacoes/cadastrar/$publicacaoId',
      caminhoArquivo,
    );
  }

  Future<void> curtir(
    int publicacaoId,
  ) async {
    await _apiService.post(
      '/curtidas/curtir',
      body: {
        'publicacaoId': publicacaoId,
      },
    );
  }

  Future<void> descurtir(
    int publicacaoId,
  ) async {
    await _apiService.delete(
      '/curtidas/descurtir',
      body: {
        'publicacaoId': publicacaoId,
      },
    );
  }

  Future<List<dynamic>> listarComentarios(
    int publicacaoId,
  ) async {
    final response = await _apiService.get(
      '/comentarios/publicacao/$publicacaoId',
    );

    if (response is! List) {
      throw Exception(
        'Formato de comentários inválido.',
      );
    }

    return response;
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
      body['comentarioPaiId'] =
          comentarioPaiId;
    }

    await _apiService.post(
      '/comentarios/cadastrar',
      body: body,
    );
  }

  Future<List<dynamic>>
      listarRankingHashtags() async {
    final response = await _apiService.get(
      '/hashtags/ranking',
    );

    if (response is! List) {
      throw Exception(
        'Formato do ranking de hashtags inválido.',
      );
    }

    return response;
  }
}