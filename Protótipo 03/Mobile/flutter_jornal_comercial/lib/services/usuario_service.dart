import '../core/constants/api_constants.dart';
import 'api_service.dart';

class UsuarioService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>> buscarUsuario(
    int usuarioId,
  ) async {
    final response = await _apiService.get(
      '${ApiConstants.usuarios}/buscar/$usuarioId',
    );

    return Map<String, dynamic>.from(response);
  }

  Future<void> atualizarBio(
    int usuarioId,
    String bio,
  ) async {
    await _apiService.put(
      '${ApiConstants.usuarios}/atualizar/$usuarioId',
      body: {
        'bio': bio,
      },
    );
  }

  Future<void> atualizarFoto(
    String caminhoArquivo,
  ) async {
    await _apiService.uploadArquivo(
      '${ApiConstants.usuarios}/foto-perfil',
      caminhoArquivo,
    );
  }

  Future<void> atualizarTemplate(
    int usuarioId,
    String caminhoArquivo,
  ) async {
    await _apiService.uploadArquivo(
      '${ApiConstants.usuarios}/template/$usuarioId',
      caminhoArquivo,
    );
  }

  Future<Object?> atualizarUsuario({required int usuarioId, required String bio}) async {}

  Future<Object?> buscarUsuarioLogado() async {}
}