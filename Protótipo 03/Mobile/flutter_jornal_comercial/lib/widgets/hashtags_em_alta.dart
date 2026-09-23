import 'package:flutter/material.dart';

import '../services/publicacao_service.dart';

class HashtagsEmAlta extends StatefulWidget {
  const HashtagsEmAlta({
    super.key,
  });

  @override
  State<HashtagsEmAlta> createState() =>
      _HashtagsEmAltaState();
}

class _HashtagsEmAltaState
    extends State<HashtagsEmAlta> {
  final PublicacaoService _service =
      PublicacaoService();

  List<dynamic> _hashtags = [];
  bool _carregando = true;

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    try {
      final ranking =
          await _service.listarRankingHashtags();

      if (!mounted) return;

      setState(() {
        _hashtags = ranking;
        _carregando = false;
      });
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _carregando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_carregando) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (_hashtags.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: const Text(
          'Ainda não existem hashtags em alta.',
          style: TextStyle(
            color: Colors.grey,
          ),
        ),
      );
    }

    final quantidadeMaxima =
        (_hashtags.first['quantidadePublicacoes'] ?? 1)
            as int;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: const Color(0xFFF0DCE4),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          const Text(
            'Hashtags em alta',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 18),

          ..._hashtags.take(10).map(
            (hashtag) {
              final quantidade =
                  hashtag['quantidadePublicacoes'] ?? 0;

              double proporcao =
                  quantidadeMaxima == 0
                      ? 0
                      : quantidade /
                          quantidadeMaxima;

              proporcao =
                  proporcao.clamp(0.0, 1.0);

              final tamanho =
                  14 + (proporcao * 7);

              return Padding(
                padding:
                    const EdgeInsets.only(bottom: 14),
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            hashtag['nome'] ?? '',
                            style: TextStyle(
                              color:
                                  const Color(0xFFC92768),
                              fontSize: tamanho,
                              fontWeight:
                                  FontWeight.w700,
                            ),
                          ),
                        ),

                        Text(
                          '$quantidade',
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 5),

                    ClipRRect(
                      borderRadius:
                          BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: proporcao,
                        minHeight: 5,
                        backgroundColor:
                            const Color(0xFFF5E7ED),
                        valueColor:
                            const AlwaysStoppedAnimation(
                          Color(0xFFC92768),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}