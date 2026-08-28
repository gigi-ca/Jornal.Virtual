import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../models/noticia.dart';
import '../../services/noticia_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final NoticiaService _noticiaService = NoticiaService();

  late Future<List<Noticia>> _noticiasFuture;

  @override
  void initState() {
    super.initState();

    _noticiasFuture = _noticiaService.listarNoticias();
  }

  Future<void> _atualizarNoticias() async {
    setState(() {
      _noticiasFuture = _noticiaService.listarNoticias();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Jornal 360°',
          style: TextStyle(
            fontWeight: FontWeight.w800,
          ),
        ),

        actions: [
          IconButton(
            onPressed: _atualizarNoticias,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),

      body: FutureBuilder<List<Noticia>>(
        future: _noticiasFuture,

        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(
                color: AppColors.primary,
              ),
            );
          }

          if (snapshot.hasError) {
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

                    const Text(
                      'Não foi possível carregar as notícias.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      snapshot.error.toString(),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                      ),
                    ),

                    const SizedBox(height: 20),

                    ElevatedButton(
                      onPressed: _atualizarNoticias,
                      child: const Text('Tentar novamente'),
                    ),
                  ],
                ),
              ),
            );
          }

          final noticias = snapshot.data ?? [];

          if (noticias.isEmpty) {
            return const Center(
              child: Text(
                'Nenhuma notícia encontrada.',
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _atualizarNoticias,

            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: noticias.length,

              itemBuilder: (context, index) {
                final noticia = noticias[index];

                return _NoticiaTesteCard(
                  noticia: noticia,
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _NoticiaTesteCard extends StatelessWidget {
  final Noticia noticia;

  const _NoticiaTesteCard({
    required this.noticia,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),

      elevation: 0,

      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(
          color: AppColors.border,
        ),
      ),

      child: Padding(
        padding: const EdgeInsets.all(18),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [
            Text(
              noticia.titulo,
              style: const TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w700,
              ),
            ),

            if (noticia.subtitulo != null &&
                noticia.subtitulo!.isNotEmpty) ...[
              const SizedBox(height: 8),

              Text(
                noticia.subtitulo!,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                ),
              ),
            ],

            const SizedBox(height: 12),

            Text(
              noticia.texto,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                height: 1.5,
              ),
            ),

            const SizedBox(height: 14),

            Text(
              'Notícia #${noticia.id}',
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}