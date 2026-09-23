import 'package:flutter/material.dart';

import '../../core/constants/api_constants.dart';
import '../../core/theme/app_colors.dart';
import '../../models/usuario.dart';
import '../../services/usuarios_service.dart';

class PerfilScreen extends StatefulWidget {
  const PerfilScreen({super.key});

  @override
  State<PerfilScreen> createState() => _PerfilScreenState();
}

class _PerfilScreenState extends State<PerfilScreen> {
  final UsuarioService _usuarioService = UsuarioService();

  Usuario? _usuario;

  bool _carregando = true;
  bool _salvando = false;

  String? _erro;

  final TextEditingController _bioController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _carregarPerfil();
  }

  @override
  void dispose() {
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _carregarPerfil() async {
    setState(() {
      _carregando = true;
      _erro = null;
    });

    try {
      final usuario = await _usuarioService.buscarUsuarioLogado();

      if (!mounted) return;

      setState(() {
        _usuario = usuario;
        _bioController.text = usuario.bio ?? '';
        _carregando = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _erro = e.toString().replaceFirst('Exception: ', '');
        _carregando = false;
      });
    }
  }

  Future<void> _salvarBio() async {
    if (_usuario == null) return;

    setState(() {
      _salvando = true;
    });

    try {
      final usuarioAtualizado = await _usuarioService.atualizarUsuario(
        usuarioId: _usuario!.id,
        bio: _bioController.text.trim(),
      );

      if (!mounted) return;

      setState(() {
        _usuario = usuarioAtualizado;
        _bioController.text = usuarioAtualizado.bio ?? '';
        _salvando = false;
      });

      Navigator.pop(context);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Perfil atualizado com sucesso!'),
        ),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _salvando = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst('Exception: ', ''),
          ),
        ),
      );
    }
  }

  void _abrirEdicao() {
    if (_usuario == null) return;

    _bioController.text = _usuario!.bio ?? '';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(28),
                ),
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 45,
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    const Text(
                      'Editar Perfil',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF18213D),
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text(
                      'Atualize as informações do seu perfil.',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),

                    const SizedBox(height: 24),

                    const Text(
                      'Bio',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF18213D),
                      ),
                    ),

                    const SizedBox(height: 8),

                    TextField(
                      controller: _bioController,
                      maxLines: 4,
                      maxLength: 300,
                      decoration: InputDecoration(
                        hintText: 'Escreva uma descrição sobre você...',
                        filled: true,
                        fillColor: const Color(0xFFFFF1F6),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(
                            color: Color(0xFFEF3F7A),
                            width: 1.5,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _salvando
                            ? null
                            : () async {
                                setModalState(() {
                                  _salvando = true;
                                });

                                await _salvarBio();

                                if (mounted) {
                                  setModalState(() {
                                    _salvando = false;
                                  });
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF3F7A),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: _salvando
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text(
                                'Salvar alterações',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _tipoUsuario(String tipo) {
    switch (tipo) {
      case 'ADMINISTRADOR':
        return 'Administradora';

      case 'VERIFICADO':
        return 'Verificado';

      default:
        return 'Usuário';
    }
  }

  String _montarUrlImagem(String? caminho) {
    if (caminho == null || caminho.isEmpty) {
      return '';
    }

    if (caminho.startsWith('http://') ||
        caminho.startsWith('https://')) {
      return caminho;
    }

    if (caminho.startsWith('/')) {
      return '${ApiConstants.baseUrl}$caminho';
    }

    return '${ApiConstants.baseUrl}/$caminho';
  }

  Widget _fotoPerfil() {
    final caminho = _usuario?.fotoPerfil;
    final url = _montarUrlImagem(caminho);

    if (url.isNotEmpty) {
      return ClipOval(
        child: Image.network(
          url,
          width: 112,
          height: 112,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return _fotoPadrao();
          },
          loadingBuilder: (context, child, progress) {
            if (progress == null) {
              return child;
            }

            return _fotoPadrao(
              carregando: true,
            );
          },
        ),
      );
    }

    return _fotoPadrao();
  }

  Widget _fotoPadrao({bool carregando = false}) {
    return Container(
      width: 112,
      height: 112,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: Color(0xFFFFD8E5),
      ),
      child: carregando
          ? const Center(
              child: CircularProgressIndicator(
                color: Color(0xFFEF3F7A),
              ),
            )
          : Center(
              child: Text(
                _usuario?.nome.isNotEmpty == true
                    ? _usuario!.nome[0].toUpperCase()
                    : '?',
                style: const TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFEF3F7A),
                ),
              ),
            ),
    );
  }

  Widget _template() {
    final caminho = _usuario?.template;
    final url = _montarUrlImagem(caminho);

    if (url.isNotEmpty) {
      return Image.network(
        url,
        width: double.infinity,
        height: 190,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return _templatePadrao();
        },
      );
    }

    return _templatePadrao();
  }

  Widget _templatePadrao() {
    return Container(
      width: double.infinity,
      height: 190,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFC92768),
            Color(0xFFEF3F7A),
            Color(0xFFFF5B91),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -45,
            right: -30,
            child: Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.12),
              ),
            ),
          ),
          Positioned(
            bottom: -70,
            left: -40,
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.10),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _informacaoCard({
    required String numero,
    required String titulo,
    required IconData icone,
  }) {
    return Expanded(
      child: Container(
        height: 95,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 12,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icone,
              color: const Color(0xFFEF3F7A),
              size: 21,
            ),
            const SizedBox(height: 5),
            Text(
              numero,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF18213D),
              ),
            ),
            Text(
              titulo,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _conteudo() {
    if (_carregando) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFFEF3F7A),
        ),
      );
    }

    if (_erro != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 50,
                color: AppColors.error,
              ),
              const SizedBox(height: 16),
              Text(
                _erro!,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _carregarPerfil,
                child: const Text('Tentar novamente'),
              ),
            ],
          ),
        ),
      );
    }

    if (_usuario == null) {
      return const Center(
        child: Text('Usuário não encontrado.'),
      );
    }

    final empresa = _usuario!.empresa;

    return RefreshIndicator(
      color: const Color(0xFFEF3F7A),
      onRefresh: _carregarPerfil,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              _template(),

              Positioned(
                bottom: -56,
                child: Container(
                  width: 124,
                  height: 124,
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.18),
                        blurRadius: 15,
                        offset: const Offset(0, 7),
                      ),
                    ],
                  ),
                  child: _fotoPerfil(),
                ),
              ),
            ],
          ),

          const SizedBox(height: 72),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Text(
                  _usuario!.nome,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 27,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF18213D),
                  ),
                ),

                const SizedBox(height: 7),

                if (empresa != null)
                  Text(
                    'REDE: ${empresa['nome'] ?? ''}',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF18213D),
                    ),
                  ),

                const SizedBox(height: 16),

                if ((_usuario!.bio ?? '').isNotEmpty)
                  Text(
                    _usuario!.bio!,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.5,
                      color: Colors.grey.shade600,
                    ),
                  )
                else
                  Text(
                    'Este usuário ainda não adicionou uma bio.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade500,
                    ),
                  ),

                const SizedBox(height: 18),

                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 9,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEF3F7A),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Text(
                    _tipoUsuario(_usuario!.tipo),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                Row(
                  children: [
                    _informacaoCard(
                      numero: '0',
                      titulo: 'Artigos',
                      icone: Icons.article_outlined,
                    ),
                    const SizedBox(width: 12),
                    _informacaoCard(
                      numero: '0',
                      titulo: 'Notícias',
                      icone: Icons.newspaper_outlined,
                    ),
                    const SizedBox(width: 12),
                    _informacaoCard(
                      numero: '0',
                      titulo: 'Projetos',
                      icone: Icons.folder_outlined,
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton.icon(
                    onPressed: _abrirEdicao,
                    icon: const Icon(Icons.edit_outlined),
                    label: const Text(
                      'Editar Perfil',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEF3F7A),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(17),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 35),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF7FA),
      appBar: AppBar(
        title: const Text(
          'Minha Conta',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFFC92768),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _conteudo(),
    );
  }
}