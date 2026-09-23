import 'package:flutter/material.dart';

import '../../core/constants/api_constants.dart';
import '../../core/theme/app_colors.dart';
import '../../models/noticia.dart';
import '../../services/noticia_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final NewsService _newsService = NewsService();

  late Future<List<Noticia>> _noticiasFuture;

  @override
  void initState() {
    super.initState();
    _carregarNoticias();
  }

  void _carregarNoticias() {
    _noticiasFuture = _newsService.listarNoticias();
  }

  Future<void> _atualizarNoticias() async {
    setState(() {
      _carregarNoticias();
    });

    await _noticiasFuture;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: RefreshIndicator(
                onRefresh: _atualizarNoticias,
                color: AppColors.primary,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),

                      const SizedBox(height: 24),

                      _buildSearch(),

                      const SizedBox(height: 28),

                      _buildSectionTitle('Destaque do dia'),

                      const SizedBox(height: 12),

                      FutureBuilder<List<Noticia>>(
                        future: _noticiasFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return _buildLoadingFeatured();
                          }

                          if (snapshot.hasError) {
                            return _buildError(
                              'Não foi possível carregar as notícias.',
                            );
                          }

                          final noticias = snapshot.data ?? [];

                          if (noticias.isEmpty) {
                            return _buildEmpty(
                              'Nenhuma notícia cadastrada.',
                            );
                          }

                          return _buildFeaturedNews(noticias.first);
                        },
                      ),

                      const SizedBox(height: 30),

                      _buildSectionTitle('Últimas notícias'),

                      const SizedBox(height: 14),

                      FutureBuilder<List<Noticia>>(
                        future: _noticiasFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return _buildLoadingList();
                          }

                          if (snapshot.hasError) {
                            return _buildError(
                              'Não foi possível carregar as notícias.',
                            );
                          }

                          final noticias = snapshot.data ?? [];

                          if (noticias.isEmpty) {
                            return _buildEmpty(
                              'Nenhuma notícia encontrada.',
                            );
                          }

                          return _buildNewsList(noticias);
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),

            _buildBottomNavigation(),
          ],
        ),
      ),
    );
  }


  Widget _buildHeader() {
    return Row(
      children: [
        GestureDetector(
          onTap: () {},
          child: const Icon(
            Icons.menu_rounded,
            size: 29,
            color: AppColors.primary,
          ),
        ),

        const SizedBox(width: 14),

        RichText(
          text: const TextSpan(
            children: [
              TextSpan(
                text: 'Jornal',
                style: TextStyle(
                  color: AppColors.text,
                  fontSize: 23,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
              TextSpan(
                text: ' Virtual',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: 23,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
        ),

        const Spacer(),

        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: AppColors.border,
            ),
          ),
          child: const Icon(
            Icons.notifications_none_rounded,
            color: AppColors.text,
            size: 22,
          ),
        ),
      ],
    );
  }

  Widget _buildSearch() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.border,
        ),
      ),
      child: const Row(
        children: [
          Icon(
            Icons.search_rounded,
            color: AppColors.textSecondary,
            size: 21,
          ),

          SizedBox(width: 10),

          Text(
            'Pesquisar notícias...',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 21,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(10),
          ),
        ),

        const SizedBox(width: 9),

        Text(
          title,
          style: const TextStyle(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
          ),
        ),
      ],
    );
  }

  Widget _buildFeaturedNews(Noticia noticia) {
    final imagem = _getImagem(noticia);

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.18),
            blurRadius: 16,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 205,
            width: double.infinity,
            child: imagem != null
                ? Image.network(
                    imagem,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return _buildImagePlaceholder(
                        height: 205,
                      );
                    },
                  )
                : _buildImagePlaceholder(
                    height: 205,
                  ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(
              17,
              16,
              17,
              18,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'DESTAQUE',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1,
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  noticia.titulo,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    height: 1.15,
                    fontWeight: FontWeight.w800,
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  noticia.subtitulo?.isNotEmpty == true
                      ? noticia.subtitulo!
                      : noticia.texto,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),

                const SizedBox(height: 15),

                Row(
                  children: [
                    const Icon(
                      Icons.person_outline_rounded,
                      color: Colors.white,
                      size: 16,
                    ),

                    const SizedBox(width: 5),

                    Text(
                      noticia.autor?['nome'] ?? 'Autor',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),

                    const SizedBox(width: 12),

                    const Icon(
                      Icons.schedule_rounded,
                      color: Colors.white,
                      size: 15,
                    ),

                    const SizedBox(width: 5),

                    Text(
                      _formatarData(noticia.dataPublicacao),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }


  Widget _buildNewsList(List<Noticia> noticias) {

    final ultimasNoticias =
        noticias.length > 1 ? noticias.sublist(1) : <Noticia>[];

    if (ultimasNoticias.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 10),
        child: Text(
          'Não há outras notícias no momento.',
          style: TextStyle(
            color: AppColors.textSecondary,
            fontSize: 13,
          ),
        ),
      );
    }

    return Column(
      children: ultimasNoticias.map((noticia) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 14),
          child: _buildNewsCard(noticia),
        );
      }).toList(),
    );
  }


  Widget _buildNewsCard(Noticia noticia) {
    final imagem = _getImagem(noticia);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(19),
        border: Border.all(
          color: AppColors.border,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: SizedBox(
              width: 105,
              height: 105,
              child: imagem != null
                  ? Image.network(
                      imagem,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return _buildImagePlaceholder(
                          height: 105,
                          width: 105,
                        );
                      },
                    )
                  : _buildImagePlaceholder(
                      height: 105,
                      width: 105,
                    ),
            ),
          ),

          const SizedBox(width: 13),

          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(
                top: 4,
                right: 3,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    noticia.titulo,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16,
                      height: 1.2,
                      fontWeight: FontWeight.w800,
                      color: AppColors.text,
                    ),
                  ),

                  const SizedBox(height: 7),

                  Text(
                    noticia.subtitulo?.isNotEmpty == true
                        ? noticia.subtitulo!
                        : noticia.texto,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 12,
                      height: 1.35,
                      color: AppColors.textSecondary,
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    'Leia mais',
                    style: TextStyle(
                      color: AppColors.primary,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }


  String? _getImagem(Noticia noticia) {
    if (noticia.midias.isEmpty) {
      return null;
    }

    final primeiraMidia = noticia.midias.first;

    if (primeiraMidia is! Map) {
      return null;
    }

    final path = primeiraMidia['path'];

    if (path == null || path.toString().isEmpty) {
      return null;
    }

    final caminho = path.toString();

    if (caminho.startsWith('http://') ||
        caminho.startsWith('https://')) {
      return caminho;
    }
    return '${ApiConstants.baseUrl}/$caminho';
  }

  Widget _buildImagePlaceholder({
    double height = 105,
    double? width,
  }) {
    return Container(
      height: height,
      width: width,
      color: AppColors.primaryLight,
      child: const Icon(
        Icons.article_outlined,
        color: AppColors.primary,
        size: 30,
      ),
    );
  }


  Widget _buildLoadingFeatured() {
    return Container(
      height: 350,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: AppColors.border,
        ),
      ),
      child: const Center(
        child: CircularProgressIndicator(
          color: AppColors.primary,
        ),
      ),
    );
  }

  Widget _buildLoadingList() {
    return Column(
      children: List.generate(
        2,
        (index) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Container(
              height: 127,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(19),
                border: Border.all(
                  color: AppColors.border,
                ),
              ),
              child: const Center(
                child: CircularProgressIndicator(
                  color: AppColors.primary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildError(String mensagem) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(19),
        border: Border.all(
          color: AppColors.border,
        ),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.cloud_off_rounded,
            color: AppColors.primary,
            size: 32,
          ),

          const SizedBox(height: 10),

          Text(
            mensagem,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
            ),
          ),

          const SizedBox(height: 12),

          TextButton(
            onPressed: () {
              setState(() {
                _carregarNoticias();
              });
            },
            child: const Text(
              'Tentar novamente',
              style: TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }


  Widget _buildEmpty(String mensagem) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(19),
        border: Border.all(
          color: AppColors.border,
        ),
      ),
      child: Text(
        mensagem,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: AppColors.textSecondary,
          fontSize: 13,
        ),
      ),
    );
  }

  String _formatarData(DateTime data) {
    final agora = DateTime.now();

    final diferenca = agora.difference(data);

    if (diferenca.inMinutes < 1) {
      return 'Agora';
    }

    if (diferenca.inMinutes < 60) {
      return '${diferenca.inMinutes} min';
    }

    if (diferenca.inHours < 24) {
      return '${diferenca.inHours}h';
    }

    if (diferenca.inDays == 1) {
      return 'Ontem';
    }

    if (diferenca.inDays < 7) {
      return '${diferenca.inDays} dias';
    }

    return '${data.day.toString().padLeft(2, '0')}/'
        '${data.month.toString().padLeft(2, '0')}/'
        '${data.year}';
  }


  Widget _buildBottomNavigation() {
    return Container(
      height: 72,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(
            color: AppColors.border,
          ),
        ),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _NavigationItem(
            icon: Icons.home_rounded,
            label: 'Início',
            selected: true,
          ),

          _NavigationItem(
            icon: Icons.article_outlined,
            label: 'Notícias',
          ),

          _NavigationItem(
            icon: Icons.bookmark_border_rounded,
            label: 'Salvos',
          ),

          _NavigationItem(
            icon: Icons.person_outline_rounded,
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}


class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;

  const _NavigationItem({
    required this.icon,
    required this.label,
    this.selected = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          icon,
          size: 23,
          color: selected
              ? AppColors.primary
              : AppColors.textSecondary,
        ),

        const SizedBox(height: 4),

        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight:
                selected ? FontWeight.w700 : FontWeight.w500,
            color: selected
                ? AppColors.primary
                : AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}