import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../models/publicacao.dart';
import '../../services/publicacao_service.dart';
import '../../widgets/hashtags_em_alta.dart';
import '../../widgets/nova_publicacao_modal.dart';
import '../../widgets/publicacao_card.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({
    super.key,
  });

  @override
  State<FeedScreen> createState() =>
      _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final PublicacaoService _service =
      PublicacaoService();

  late Future<List<Publicacao>> _publicacoesFuture;

  int? _usuarioId;

  @override
  void initState() {
    super.initState();

    _publicacoesFuture =
        _carregarPublicacoes();

    _carregarUsuario();
  }

  Future<void> _carregarUsuario() async {
    final prefs =
        await SharedPreferences.getInstance();

    if (!mounted) return;

    setState(() {
      _usuarioId =
          prefs.getInt('usuarioId');
    });
  }

  Future<List<Publicacao>>
      _carregarPublicacoes() async {
    return _service.listarPublicacoes();
  }

  void _atualizarFeed() {
    setState(() {
      _publicacoesFuture =
          _carregarPublicacoes();
    });
  }

  Future<void> _abrirNovaPublicacao() async {
    await showDialog(
      context: context,
      builder: (_) => NovaPublicacaoModal(
        atualizar: _atualizarFeed,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF8F5F7),

      appBar: AppBar(
        backgroundColor:
            const Color(0xFFD52B6D),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Feed',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            onPressed: _atualizarFeed,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),

      floatingActionButton:
          FloatingActionButton.extended(
        onPressed: _abrirNovaPublicacao,
        backgroundColor:
            const Color(0xFFC92768),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text(
          'Publicar',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: LayoutBuilder(
        builder: (context, constraints) {
          final telaGrande =
              constraints.maxWidth >= 900;

          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: 1200,
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: telaGrande
                    ? Row(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 7,
                            child: _feed(),
                          ),

                          const SizedBox(width: 20),

                          SizedBox(
                            width: 300,
                            child:
                                const HashtagsEmAlta(),
                          ),
                        ],
                      )
                    : _feed(),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _feed() {
    return FutureBuilder<List<Publicacao>>(
      future: _publicacoesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState ==
            ConnectionState.waiting) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(40),
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 45,
                  color: Colors.grey,
                ),

                const SizedBox(height: 10),

                const Text(
                  'Não foi possível carregar o feed.',
                ),

                const SizedBox(height: 10),

                ElevatedButton(
                  onPressed: _atualizarFeed,
                  child: const Text('Tentar novamente'),
                ),
              ],
            ),
          );
        }

        final publicacoes =
            snapshot.data ?? [];

        if (publicacoes.isEmpty) {
          return Center(
            child: Container(
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(18),
              ),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.forum_outlined,
                    size: 50,
                    color: Color(0xFFC92768),
                  ),

                  SizedBox(height: 12),

                  Text(
                    'Ainda não há publicações.',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  SizedBox(height: 5),

                  Text(
                    'Seja a primeira pessoa a publicar!',
                    style: TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () async {
            _atualizarFeed();
          },
          child: ListView.builder(
            padding:
                const EdgeInsets.only(bottom: 100),
            itemCount: publicacoes.length,
            itemBuilder: (context, index) {
              return PublicacaoCard(
                publicacao: publicacoes[index],
                usuarioId: _usuarioId,
                atualizar: _atualizarFeed,
              );
            },
          ),
        );
      },
    );
  }
}